use serde::Deserialize;

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
