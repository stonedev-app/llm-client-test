use reqwest::Client;
use serde_json::json;

use super::ollama_types::{ChatResponse, ErrorResponse};
use crate::front::front_types::MessageDTO;

#[tauri::command]
pub async fn ollama_api_chat(messages: Vec<MessageDTO>) -> Result<String, String> {
    // 事前準備
    // ollamaのコンテナを起動
    // docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
    // モデル(gemma3:1b-it-qat)をダウンロード
    // docker exec -it ollama ollama pull gemma3:1b-it-qat

    // プロキシの設定されていると向き先がlocalhostでもプロキシ経由しようとするので、no_proxyを追加
    // クライアント生成
    let client = match Client::builder().no_proxy().build() {
        Ok(c) => c,
        Err(e) => return Err(format!("クライアント生成失敗: {}", e.to_string())),
    };

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
        "stream": false
    });

    // ollamaにリクエスト
    let res = match client
        .post("http://localhost:11434/api/chat")
        .json(&body)
        .send()
        .await
    {
        Ok(response) => response,
        Err(e) => return Err(format!("接続失敗: {}", e.to_string())),
    };

    // HTTPステータスを取得
    let http_status = res.status();

    // レスポンス文字列(json)を取得
    let text = match res.text().await {
        Ok(t) => t,
        Err(e) => return Err(format!("受信失敗: {}", e.to_string())),
    };

    // HTTPステータスが200番台の場合
    if http_status.is_success() {
        // JSONとして解析する
        let chat: ChatResponse = match serde_json::from_str(&text) {
            Ok(t) => t,
            Err(e) => return Err(format!("JSON解析失敗: {}", e.to_string())),
        };
        // コンテントを返却する
        return Ok(chat.message.content);
    // その他の場合
    } else {
        // JSONとして解析する
        let error: ErrorResponse = match serde_json::from_str(&text) {
            Ok(t) => t,
            Err(e) => return Err(format!("JSON解析失敗: {}", e.to_string())),
        };
        // エラーを返却する
        return Ok(error.error);
    }
}
