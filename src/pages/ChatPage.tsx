import { useState } from "react";
import ChatHistory from "../components/ui/ChatHistory";
import ChatInput from "../components/ui/ChatInput";
import { Message } from "../types/Message";

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
    <>
      {/* メッセージがまだない場合は、チャット履歴は表示しない */}
      {messages.length > 0 && <ChatHistory messages={messages} />}
      <ChatInput onSend={handleSend} />
    </>
  );
}
