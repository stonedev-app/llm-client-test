use reqwest::Client;

use crate::front::types::{llm_err, LLMApiErrorDTO, LLMApiErrorType};
use crate::llm::ollama::types::{ErrorResponse, ModelsResponse};

#[tauri::command]
pub async fn ollama_api_tags() -> Result<Vec<String>, LLMApiErrorDTO> {
    // 開始ログ
    log::info!("Tauri command `ollama_api_tags` started.");

    // プロキシの設定されていると向き先がlocalhostでもプロキシ経由しようとするので、no_proxyを追加
    // クライアント生成
    let client = Client::builder()
        .no_proxy()
        .build()
        .map_err(|e| llm_err(LLMApiErrorType::Network, "クライアント生成失敗", e))?;

    // ollamaにリクエスト
    let res = client
        .get("http://localhost:11434/api/tags")
        .send()
        .await
        .map_err(|e| llm_err(LLMApiErrorType::Network, "接続失敗", e))?;

    // HTTPステータスを取得
    let http_status = res.status();

    // レスポンスボディを文字列として取得
    let body = res
        .text()
        .await
        .map_err(|e| llm_err(LLMApiErrorType::Receive, "受信失敗", e))?;

    // HTTPステータスが200番台の場合
    if http_status.is_success() {
        // JSONとして解析、モデル一覧を取得
        let models_res: ModelsResponse = serde_json::from_str(&body)
            .map_err(|e| llm_err(LLMApiErrorType::Parse, "JSON解析失敗", e))?;

        // モデル名一覧
        let model_names: Vec<String> = models_res.models.into_iter().map(|m| m.name).collect();

        // 正常終了時ログ
        log::info!(
            "Tauri command `ollama_api_tags` finished Ok. model_names_length={}",
            model_names.len()
        );

        // モデル名一覧を返却
        return Ok(model_names);
    }
    // HTTPステータスが200番台でない場合
    else {
        // JSONとして解析、エラーメッセージを取得
        let error_res: ErrorResponse = serde_json::from_str(&body)
            .map_err(|e| llm_err(LLMApiErrorType::Parse, "JSON解析失敗", e))?;

        // エラー返却
        return Err(llm_err(
            LLMApiErrorType::Http,
            "Ollamaエラー",
            error_res.error,
        ));
    }
}
