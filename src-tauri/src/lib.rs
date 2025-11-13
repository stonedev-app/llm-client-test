mod front;
mod llm;

use llm::ollama_api_chat;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![ollama_api_chat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
