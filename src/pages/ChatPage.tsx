import { useState, useRef, useEffect } from "react";
import { Alert, Box } from "@mui/material";

// コンポーネント
import { Header } from "../components/ui/Header";
import { ChatHistory } from "../components/ui/ChatHistory";
import { ChatInput } from "../components/ui/ChatInput";
// カスタムフック
import { useModelNames } from "../hooks/useModelNames";
import { useMessageListener } from "../hooks/useMessageListener";
import { useAutoScroll } from "../hooks/useAutoScroll";
// 型定義
import { ApiMessage, UiMessage, UiMessageDraft } from "../types/Message";
// API
import { requestApiChat } from "../api/llm/ollama/requestApiChat";
import { LLMApiErrorTypeEnum } from "../types/LLMApiError";

/**
 * チャット画面コンポーネント
 *
 * @returns JSX要素
 */
export function ChatPage() {
  // 次のUIメッセージID
  const nextUiMessageId = useRef(0);

  // UIメッセージ配列
  const [uiMessages, setUiMessages] = useState<UiMessage[]>([]);
  // 送信中フラグ
  const [isSending, setIsSending] = useState(false);
  // システムエラー(ネットワークエラーなど)
  const [systemError, setSystemError] = useState<string | null>(null);
  // 選択されたモデル
  const [selectedModel, setSelectedModel] = useState<string>("");

  // チャット履歴の最後のメッセージ参照
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // モデル名一覧取得
  const { modelNames, error } = useModelNames();
  // 選択モデルの初期化
  useEffect(() => {
    // モデル名一覧が存在し、かつ選択モデルが未設定の場合
    if (modelNames.length > 0 && selectedModel === "") {
      // モデル名一覧の最初のモデルを設定
      setSelectedModel(modelNames[0]);
    }
  }, [modelNames, selectedModel]);
  // モデル名取得エラー処理
  useEffect(() => {
    // モデル名取得エラーが発生した場合
    if (error) {
      // システムエラーメッセージ設定
      setSystemError(error);
    }
  }, [error]);

  // 受信中メッセージ(ストリーミングメッセージ)
  const { message: receivingMessage, reset: resetMessage } =
    useMessageListener();

  // 自動スクロール
  useAutoScroll(lastMessageRef, uiMessages);

  /**
   * UIメッセージ配列に新規メッセージを追加
   * @param draftMsg 下書きメッセージ
   */
  const appendUiMessage = (draftMsg: UiMessageDraft) => {
    // UIメッセージ配列に新規メッセージを追加
    setUiMessages((prev) => [
      ...prev,
      {
        id: nextUiMessageId.current++,
        ...draftMsg,
      },
    ]);
  };

  /**
   * API用メッセージ配列を構築
   * @param message 新規メッセージテキスト
   * @param uiMessages UIメッセージ配列
   * @returns APIメッセージ配列
   */
  const buildApiMessages = (
    message: string,
    uiMessages: UiMessage[]
  ): ApiMessage[] => {
    // UIメッセージ配列をAPIメッセージ配列に変換し、新規メッセージを追加して返す
    return [
      ...uiMessages.map((msg) => ({
        text: msg.text,
        fromMe: msg.fromMe,
      })),
      {
        text: message,
        fromMe: true,
      },
    ];
  };

  // メッセージ送信イベント
  const handleSend = async (message: string) => {
    // 二重送信防止
    if (isSending) return;

    // メッセージ送信開始
    setIsSending(true);

    try {
      // 送信メッセージをメッセージ配列に追加
      appendUiMessage({ text: message, fromMe: true, error: false });
      // LLMにメッセージ送信
      const result = await requestApiChat(
        selectedModel,
        buildApiMessages(message, uiMessages)
      );
      // 結果が成功の場合
      if (result.ok) {
        // 応答メッセージをメッセージ配列に追加
        appendUiMessage({ text: result.value, fromMe: false, error: false });
      }
      // 結果がエラーの場合
      else {
        // LLMApiエラーの場合
        if (result.error.kind === LLMApiErrorTypeEnum.Http) {
          // メッセージ配列にエラーメッセージを追加
          appendUiMessage({
            text: result.error.message,
            fromMe: false,
            error: true,
          });
        }
        // その他のエラーの場合
        else {
          // システムエラーメッセージ設定
          setSystemError(result.error.message);
        }
      }
    } finally {
      // メッセージ送信終了
      setIsSending(false);
      // 受信中メッセージをクリア
      resetMessage();
    }
  };

  // メッセージ配列が存在するか
  const hasMessages = uiMessages.length > 0;
  // モデルが選択されているか
  const isSelectedModel = selectedModel !== "";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      {/* ヘッダー */}
      <Header
        models={modelNames}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        // 送信中、もしくはモデル名が存在しない場合は選択不可
        disabled={isSending || modelNames.length === 0}
      />

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
              messages={uiMessages}
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
          <ChatInput
            onSend={handleSend}
            isSending={isSending}
            isSelectedModel={isSelectedModel}
          />
        </Box>
      </Box>
    </Box>
  );
}
