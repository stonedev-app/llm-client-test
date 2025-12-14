import { useState, useRef } from "react";
import { Alert, Box } from "@mui/material";

// コンポーネント
import { Header } from "../components/ui/Header";
import { ChatHistory } from "../components/ui/ChatHistory";
import { ChatInput } from "../components/ui/ChatInput";
// カスタムフック
import { useMessageListener } from "../hooks/useMessageListener";
import { useAutoScroll } from "../hooks/useAutoScroll";
// 型定義
import { Message } from "../types/Message";
// API
import { requestApiChat } from "../api/llm/ollama/requestApiChat";

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
  // システムエラー(ネットワークエラーなど)
  const [systemError, setSystemError] = useState<string | null>(null);
  // 選択されたモデル
  const [selectedModel, setSelectedModel] =
    useState<string>("gemma3:1b-it-qat");

  // チャット履歴の最後のメッセージ参照
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // カスタムフック
  // 受信中メッセージ(ストリーミングメッセージ)
  const { message: receivingMessage, reset: resetMessage } =
    useMessageListener();
  // 自動スクロール
  useAutoScroll(lastMessageRef, messages);

  // メッセージ送信イベント
  const handleSend = async (message: string) => {
    // 二重送信防止
    if (isSending) return;

    // メッセージ送信開始
    setIsSending(true);

    try {
      // 新規メッセージを追加したメッセージ配列を生成
      const newMessages: Message[] = [
        ...messages,
        {
          id: messages.length + 1,
          text: message,
          fromMe: true,
        },
      ];
      // メッセージ配列を設定
      setMessages(newMessages);
      // LLMにメッセージ送信
      await requestApiChat(
        selectedModel,
        newMessages.map((msg) => ({ ...msg })),
        setMessages,
        setSystemError
      );
    } finally {
      // メッセージ送信終了
      setIsSending(false);
      // 受信中メッセージをクリア
      resetMessage();
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
      }}
    >
      {/* ヘッダー */}
      <Header selectedModel={selectedModel} onModelChange={setSelectedModel} />

      {/* メインコンテンツ */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          p: 4,
          overflowY: "auto",
          mx: "auto",
          maxWidth: "700px",
          width: "100%",
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
            <ChatHistory
              messages={messages}
              isSending={isSending}
              receivingMessage={receivingMessage}
              lastMessageRef={lastMessageRef}
            />
          </Box>
        )}

        {/* システムエラーが発生した場合はアラートを表示 */}
        {systemError && (
          <Box sx={{ mb: 2 }}>
            <Alert
              sx={{
                borderRadius: 3,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
              severity="error"
              onClose={() => setSystemError(null)}
            >
              {systemError}
            </Alert>
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
    </Box>
  );
}
