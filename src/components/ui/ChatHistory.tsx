import { Box, Paper, Typography } from "@mui/material";
import { Message } from "../../types/Message";

/**
 * チャット履歴プロパティ
 * @property messages メッセージ配列
 * @property isSending 送信中
 * @property receivingMessage 受信中メッセージ
 * @property lastMessageRef? 最後のメッセージへの参照(※スクロールが必要な場合は設定)
 */
interface ChatHistoryProps {
  messages: Message[];
  isSending: boolean;
  receivingMessage: string;
  lastMessageRef?: React.Ref<HTMLDivElement>;
}

/**
 * チャット履歴コンポーネント
 *
 * @param props チャット履歴プロパティ
 * @param props.messages メッセージ配列
 * @param props.isSending 送信中
 * @param props.receivingMessage 受信中メッセージ
 * @param props.lastMessageRef 最後のメッセージへの参照
 * @returns JSX要素
 */
export default function ChatHistory({
  messages,
  isSending,
  receivingMessage,
  lastMessageRef,
}: ChatHistoryProps) {
  // チャット履歴に表示するメッセージ配列
  const displayMessages = [...messages];

  // 送信中の場合
  if (isSending) {
    // 仮メッセージを追加する
    displayMessages.push({
      // 仮ID
      id: -1,
      // 受信中メッセージを設定。未受信の場合は「入力中…」を設定
      text: receivingMessage || "入力中…",
      fromMe: false,
    });
  }

  return (
    <Box
      sx={{
        width: "100%",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 2,
        bgcolor: "grey.100",
        borderRadius: 3,
      }}
    >
      {displayMessages.map((msg, idx) => (
        <Box
          key={msg.id}
          // 最後のメッセージだけ参照を追加する
          ref={idx === displayMessages.length - 1 ? lastMessageRef : null}
          sx={{
            display: "flex",
            justifyContent: msg.fromMe ? "flex-end" : "flex-start",
          }}
        >
          <Paper
            sx={{
              p: 1,
              bgcolor: msg.fromMe ? "primary.main" : "grey.300",
              color: msg.fromMe ? "white" : "black",
              borderRadius: 2,
              maxWidth: "70%",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {msg.text}
            </Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}
