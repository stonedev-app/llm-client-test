use serde::{Deserialize, Serialize};

/// MessageDTO
///
/// フロント側から受け取るメッセージ
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageDTO {
    /// メッセージ
    pub text: String,
    /// ユーザーが送信したかどうか
    pub from_me: bool,
}

/// LLMApiErrorDTO
///
/// LLM APIエラー
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LLMApiErrorDTO {
    /// エラー種別
    pub kind: LLMApiErrorType,
    /// エラーメッセージ
    pub message: String,
}

/// LLMApiErrorType
///
/// LLM API エラー種別
#[allow(dead_code)]
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum LLMApiErrorType {
    /// DNS エラー、プロキシ、接続拒否などネットワークエラー
    Network,
    /// HTTPステータス異常(LLMのエラー)
    Http,
    /// 受信中エラー
    Receive,
    /// JSONパースエラー
    Parse,
    /// 不明なエラー
    Unknown,
}

/// llm_err
///
/// LLM APIエラー作成
pub fn llm_err(kind: LLMApiErrorType, message: &str, e: impl std::fmt::Display) -> LLMApiErrorDTO {
    // メッセージ作成
    let msg = format!("{}: {}", message, e);
    // エラーログ出力
    log::error!("{}", msg);
    // LLM APIエラー 作成・返却
    LLMApiErrorDTO { kind, message: msg }
}
