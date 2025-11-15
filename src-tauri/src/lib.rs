mod front;
mod llm;

use llm::ollama_api_chat;

// ログ出力先
// Linux    $XDG_DATA_HOME/{bundleIdentifier}/logs
//          $HOME/.local/share/{bundleIdentifier}/logs
// 例       /home/alice/.local/share/com.tauri.dev/logs
// macOS    {homeDir}/Library/Logs/{bundleIdentifier}
// 例       /Users/Alice/Library/Logs/com.tauri.dev
// Windows  {FOLDERID_LocalAppData}/{bundleIdentifier}/logs
// 例       C:\Users\Alice\AppData\Local\com.tauri.dev\logs

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // ログ設定
    // デバックモード
    let level = if cfg!(debug_assertions) {
        log::LevelFilter::Debug
    }
    // リリースモード
    else {
        log::LevelFilter::Info
    };

    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::new()
                // ログレベルを指定
                .level(level)
                // ログ最大ファイルサイズを設定
                .max_file_size(50_000 /* bytes */)
                // ログ日付にローカル・タイムゾーンを設定
                .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![ollama_api_chat])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
