import { useState } from "react";
import { Box } from "@mui/material";
import ChatHistory from "../components/ui/ChatHistory";
import ChatInput from "../components/ui/ChatInput";
import { Message } from "../types/Message";

/**
 * チャット画面コンポーネント
 *
 * @returns JSX要素
 */
export function ChatPage() {
  // メッセージ配列
  const [messages, setMessages] = useState<Message[]>([]);

  // メッセージ送信イベント
  const handleSend = (message: string) => {
    // TODO: デバッグ用。後で消すこと
    console.log("送信:", message);
    // 新規メッセージ
    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      fromMe: true,
    };
    // メッセージ配列に新規メッセージを追加して再設定
    setMessages([...messages, newMessage]);
    // TODO: メッセージ送信処理を実装すること
  };

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
      {messages.length > 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatHistory messages={messages} />
          <ChatInput onSend={handleSend} />
        </Box>
      ) : (
        // チャット履歴がない場合は画面中央(上下方向)に表示
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChatInput onSend={handleSend} />
        </Box>
      )}
    </Box>
  );
}
