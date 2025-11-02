use reqwest::Client;
use serde_json::json;

#[tauri::command]
async fn request_llm(prompt: String) -> Result<String, String> {
    let client = Client::new();

    let body = json!({
        "model": "gemma3:1b-it-qat",
        "prompt": prompt
    });

    let res = match client
        .post("http://localhost:11434/api/generate")
        .json(&body)
        .send()
        .await
    {
        Ok(response) => response,
        Err(e) => return Err(e.to_string()),
    };

    let text = match res.text().await {
        Ok(t) => t,
        Err(e) => return Err(e.to_string()),
    };

    return Ok(text);
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![request_llm])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
