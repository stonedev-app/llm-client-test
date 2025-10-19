// 入力メッセージ送信処理
#[tauri::command]
fn send_message(message: &str) -> String {
    // TODO: メッセージ送信処理を実装すること
    format!("Send message OK. [{}]", message)
}

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![send_message])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
