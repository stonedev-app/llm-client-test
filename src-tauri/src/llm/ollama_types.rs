use serde::Deserialize;

/// Chat response
///
/// 参考URL
/// https://docs.ollama.com/api/chat
#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct ChatResponse {
    /// Model name used to generate this message
    pub model: String,

    /// Timestamp of response creation (ISO 8601)
    pub created_at: String,

    /// object
    pub message: Message,

    /// Indicates whether the chat response has finished
    pub done: bool,

    /// Reason the response finished
    pub done_reason: String,

    /// Total time spent generating in nanoseconds
    pub total_duration: u64,

    /// Time spent loading the model in nanoseconds
    pub load_duration: u64,

    /// Number of tokens in the prompt
    pub prompt_eval_count: u32,

    /// Time spent evaluating the prompt in nanoseconds
    pub prompt_eval_duration: u64,

    /// Number of tokens generated in the response
    pub eval_count: u32,

    /// Time spent generating tokens in nanoseconds
    pub eval_duration: u64,
}

/// Message
///
/// 参考URL
/// https://docs.ollama.com/api/chat
#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct Message {
    /// Always assistant for model responses
    pub role: String,

    /// Assistant message text
    pub content: String,
}

/// Error message
///
/// 参考URL
/// https://docs.ollama.com/api/errors
#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct ErrorResponse {
    /// error message
    pub error: String,
}
