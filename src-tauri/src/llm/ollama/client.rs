use futures_util::stream::StreamExt;
use reqwest::Client;
use serde_json::json;
use tauri::{AppHandle, Emitter};
use tokio::io::{AsyncBufReadExt, BufReader};
use tokio_util::io::StreamReader;

use super::types::{ChatOrErrorResponse, ErrorResponse};
use crate::front::types::{LLMApiErrorDTO, LLMApiErrorType, MessageDTO};

#[tauri::command]
pub async fn ollama_api_chat(
    app: AppHandle,
    messages: Vec<MessageDTO>,
) -> Result<String, LLMApiErrorDTO> {
    // 開始ログ
    log::info!(
        "Tauri command `ollama_api_chat` started. messages: {}",
        messages.len()
    );

    // 事前準備
    // ollamaのコンテナを起動
    // docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
    // モデル(gemma3:1b-it-qat)をダウンロード
    // docker exec -it ollama ollama pull gemma3:1b-it-qat

    // プロキシの設定されていると向き先がlocalhostでもプロキシ経由しようとするので、no_proxyを追加
    // クライアント生成
    let client = Client::builder().no_proxy().build().map_err(|e| {
        // エラーログ
        log::error!("Tauri command `ollama_api_chat` failed: {}", e);
        // エラー返却
        LLMApiErrorDTO {
            kind: LLMApiErrorType::Network,
            message: format!("クライアント生成失敗: {}", e),
        }
    })?;

    // messages を ollama API 用の形式に変換
    let api_messages: Vec<serde_json::Value> = messages
        .into_iter()
        .map(|m| {
            json!({
                // ユーザーが入力したメッセージはuser、LLMはassistantを設定する
                "role": if m.from_me { "user" } else { "assistant" },
                // ユーザー、又はLLMのメッセージ
                "content": m.text
            })
        })
        .collect();

    // jsonリクエスト内容
    let body = json!({
        "model": "gemma3:1b-it-qat",    // モデルは固定値
        "messages": api_messages,
        "stream": true                 // ストリーミング有効
    });

    // ollamaにリクエスト
    let res = client
        .post("http://localhost:11434/api/chat")
        .json(&body)
        .send()
        .await
        .map_err(|e| {
            // エラーログ
            log::error!("Tauri command `ollama_api_chat` failed: {}", e);
            // エラー返却
            LLMApiErrorDTO {
                kind: LLMApiErrorType::Network,
                message: format!("接続失敗: {}", e),
            }
        })?;

    // HTTPステータスを取得
    let http_status = res.status();

    // StreamReaderを取得
    let stream_reader = StreamReader::new(
        res.bytes_stream()
            .map(|r| r.map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))),
    );
    // BufReaderを取得
    let buf_reader = BufReader::new(stream_reader);
    // Linesを取得
    let mut lines = buf_reader.lines();

    // レスポンスメッセージ
    let mut res_message = String::new();

    // 1行ずつレスポンスを取得する
    while let Some(line) = lines.next_line().await.map_err(|e| {
        // エラーログ
        log::error!("Tauri command `ollama_api_chat` failed: {}", e);
        // エラー返却
        LLMApiErrorDTO {
            kind: LLMApiErrorType::Stream,
            message: format!("受信失敗: {}", e.to_string()),
        }
    })? {
        // HTTPステータスが200番台でない場合、1行のみでErrorResponse
        if !http_status.is_success() {
            // JSONとして解析する
            let error_res: ErrorResponse = serde_json::from_str(&line).map_err(|e| {
                // エラーログ
                log::error!("Tauri command `ollama_api_chat` failed: {}", e);
                // エラー返却
                LLMApiErrorDTO {
                    kind: LLMApiErrorType::Parse,
                    message: format!("JSON解析失敗: {}", e),
                }
            })?;
            // エラーログ
            log::error!(
                "Tauri command `ollama_api_chat` failed: {}",
                error_res.error
            );
            // エラー返却
            return Err(LLMApiErrorDTO {
                kind: LLMApiErrorType::Http,
                message: format!("Ollamaエラー: {}", error_res.error),
            });
        }
        // HTTPステータスが200番台の場合、少なくとも1行目はChatResponse
        // 途中、ErrorResponseで終了の場合あり
        else {
            // JSONとして解析する
            let res: ChatOrErrorResponse = serde_json::from_str(&line).map_err(|e| {
                // エラーログ
                log::error!("Tauri command `ollama_api_chat` failed: {}", e);
                // エラー返却
                LLMApiErrorDTO {
                    kind: LLMApiErrorType::Parse,
                    message: format!("JSON解析失敗: {}", e),
                }
            })?;
            match res {
                // 正常レスポンスの場合
                ChatOrErrorResponse::Chat(chat) => {
                    // フロントに受信したメッセージを送信
                    app.emit("receiving_message", chat.message.content.clone())
                        .map_err(|e| {
                            // エラーログ
                            log::error!("Tauri command `ollama_api_chat` failed: {}", e);
                            // エラー返却
                            LLMApiErrorDTO {
                                kind: LLMApiErrorType::Stream,
                                message: format!("ストリームエラー: {}", e),
                            }
                        })?;
                    // レスポンスメッセージに受信したメッセージを追加する
                    res_message.push_str(&chat.message.content);
                }
                // エラーレスポンスの場合
                ChatOrErrorResponse::Error(err) => {
                    // エラーログ
                    log::error!("Tauri command `ollama_api_chat` failed: {}", err.error);
                    // エラー返却
                    return Err(LLMApiErrorDTO {
                        kind: LLMApiErrorType::Http,
                        message: format!("Ollamaエラー: {}", err.error),
                    });
                }
            }
        }
    }

    // 正常終了時ログ
    log::info!(
        "Tauri command `ollama_api_chat` finished Ok. response_length={}",
        res_message.len()
    );

    // レスポンスメッセージを返却する
    Ok(res_message)
}
