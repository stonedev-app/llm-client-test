use serde::Deserialize;

/// Chat request
///
/// 参考URL
/// https://docs.ollama.com/api/chat
#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct ChatRequest {
    /// Model name used to generate this message
    pub model: String,

    /// object
    pub message: Message,
}

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
    pub done_reason: Option<String>,

    /// Total time spent generating in nanoseconds
    pub total_duration: Option<u64>,

    /// Time spent loading the model in nanoseconds
    pub load_duration: Option<u64>,

    /// Number of tokens in the prompt
    pub prompt_eval_count: Option<u32>,

    /// Time spent evaluating the prompt in nanoseconds
    pub prompt_eval_duration: Option<u64>,

    /// Number of tokens generated in the response
    pub eval_count: Option<u32>,

    /// Time spent generating tokens in nanoseconds
    pub eval_duration: Option<u64>,
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

/// Chat response or Error message
#[derive(serde::Deserialize, Debug)]
#[serde(untagged)]
pub enum ChatOrErrorResponse {
    /// Chat response
    Chat(ChatResponse),

    /// Error message
    Error(ErrorResponse),
}

/// List models resonse
///
/// 参考URL
/// https://docs.ollama.com/api/tags
#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct ModelsResponse {
    /// List available models
    pub models: Vec<Model>,
}

/// model
#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct Model {
    /// Model name
    pub name: String,

    /// Last modified timestamp in ISO 8601 format
    pub modified_at: String,

    /// Total size of the model on disk in bytes
    pub size: u64,

    /// SHA256 digest identifier of the model contents
    pub digest: String,

    /// Additional information about the model's format and family
    pub details: Details,
}

/// details
#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct Details {
    /// Model file format (for example gguf)
    pub format: String,

    /// Primary model family (for example llama)
    pub family: String,

    /// All families the model belongs to, when applicable
    pub families: Vec<String>,

    /// Approximate parameter count label (for example 7B, 13B)
    pub parameter_size: String,

    /// Quantization level used (for example Q4_0)
    pub quantization_level: String,
}
