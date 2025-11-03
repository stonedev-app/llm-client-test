mod types;

use reqwest::Client;
use serde_json::json;
use types::ChatResponse;

#[tauri::command]
pub async fn request_llm(content: String) -> Result<String, String> {
    // 事前準備
    // ollamaのコンテナを起動
    // docker run -d -v ollama:/root/.ollama -p 11434:11434 --name ollama ollama/ollama
    // モデル(gemma3:1b-it-qat)をダウンロード
    // docker exec -it ollama ollama pull gemma3:1b-it-qat

    // クライアント生成
    let client = Client::new();

    // jsonリクエスト内容
    let body = json!({
        "model": "gemma3:1b-it-qat",    // モデルは固定値
        "messages": [{
          "role": "user",
          "content": content
        }],
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

    // レスポンス文字列(json)を取得
    let text = match res.text().await {
        Ok(t) => t,
        Err(e) => return Err(format!("受信失敗: {}", e.to_string())),
    };

    // JSONとして解析する
    let chat: ChatResponse = match serde_json::from_str(&text) {
        Ok(t) => t,
        Err(e) => return Err(format!("JSON解析失敗: {}", e.to_string())),
    };

    // コンテントを返却する
    return Ok(chat.message.content);
}
