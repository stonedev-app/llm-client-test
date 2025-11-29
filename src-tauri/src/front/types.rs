use serde::{Deserialize, Serialize};

/// MessageDTO
///
/// フロント側から受け取るメッセージ
#[allow(dead_code)]
#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageDTO {
    /// id
    pub id: u32,
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
#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum LLMApiErrorType {
    /// DNS エラー、プロキシ、接続拒否などネットワークエラー
    Network,
    /// HTTPステータス異常(LLMのエラー)
    Http,
    /// ストリーミング中のエラー
    Stream,
    /// JSONパースエラー
    Parse,
}
