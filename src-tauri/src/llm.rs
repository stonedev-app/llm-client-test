use reqwest::Client;
use serde_json::{json, Value};

#[tauri::command]
pub async fn request_llm(prompt: String) -> Result<String, String> {
    // クライアント生成
    let client = Client::new();

    // jsonリクエスト内容
    let body = json!({
        "model": "gemma3:1b-it-qat",    // モデルは固定値
        "prompt": prompt
    });

    // ollamaにリクエスト
    let res = match client
        .post("http://localhost:11434/api/generate")
        .json(&body)
        .send()
        .await
    {
        Ok(response) => response,
        Err(e) => return Err(e.to_string()),
    };

    // レスポンス文字列(json)を取得
    let text = match res.text().await {
        Ok(t) => t,
        Err(e) => return Err(e.to_string()),
    };

    // 応答文字列に整形する
    let mut result = String::new();
    // １行ずつ処理する
    for line in text.lines() {
        // jsonとして解析する
        if let Ok(json) = serde_json::from_str::<Value>(line) {
            // responseキーの値を取得
            if let Some(response_part) = json.get("response").and_then(|v| v.as_str()) {
                // 取得した値を応答文字列に追加する
                result.push_str(response_part);
            }
        }
    }

    // 応答文字列を返却する
    return Ok(result);
}
