import { useState } from "react";
import { Box } from "@mui/material";
import ChatHistory from "../components/ui/ChatHistory";
import ChatInput from "../components/ui/ChatInput";
import { Message } from "../types/Message";
import { requestLLM } from "../api/llmClient";

/**
 * チャット画面コンポーネント
 *
 * @returns JSX要素
 */
export function ChatPage() {
  // メッセージ配列
  const [messages, setMessages] = useState<Message[]>([]);
  // 送信中フラグ
  const [isSending, setIsSending] = useState(false);

  // メッセージ送信イベント
  const handleSend = async (message: string) => {
    // 二重送信防止
    if (isSending) return;

    // メッセージ送信開始
    setIsSending(true);

    try {
      // メッセージ配列に新規メッセージを追加して再設定
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: message,
          fromMe: true,
        },
      ]);
      // LLMにメッセージ送信
      await requestLLM(message, setMessages);
    } finally {
      // メッセージ送信終了
      setIsSending(false);
    }
  };

  // メッセージ配列が存在するか
  const hasMessages = messages.length > 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        p: 4,
        mx: "auto",
        maxWidth: "700px",
      }}
    >
      {hasMessages && (
        // メッセージ配列がある場合は、チャット履歴を表示
        // チャット入力欄は画面下に移動
        <Box
          sx={{
            display: "flex",
            flex: 1,
            overflowY: "auto",
            mb: 2,
          }}
        >
          <ChatHistory messages={messages} isSending={isSending} />
        </Box>
      )}
      {/* チャット入力欄 */}
      {/* チャット履歴がない場合は、画面中央(上下方向) */}
      <Box
        sx={{
          flex: !hasMessages ? 1 : 0,
          display: "flex",
          alignItems: !hasMessages ? "center" : "stretch",
        }}
      >
        <ChatInput onSend={handleSend} isSending={isSending} />
      </Box>
    </Box>
  );
}
