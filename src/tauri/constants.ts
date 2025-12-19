// tauri コマンド名
export const Commands = {
  ollamaApiChat: "ollama_api_chat",
  ollamaApiTags: "ollama_api_tags",
} as const;

// tauri イベント名
export const Events = {
  receivingMessage: "receiving_message",
} as const;
