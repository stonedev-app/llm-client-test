import { Box, Paper, Typography } from "@mui/material";
import { Message } from "../../types/Message";

/**
 * チャット履歴プロパティ
 * @property messages メッセージ配列
 */
interface ChatHistoryProps {
  messages: Message[];
}

/**
 * チャット履歴コンポーネント
 *
 * @param props チャット履歴プロパティ
 * @param props.messages メッセージ配列
 * @returns JSX要素
 */
export default function ChatHistory({ messages }: ChatHistoryProps) {
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
      {messages.map((msg) => (
        <Box
          key={msg.id}
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
            <Typography variant="body2">{msg.text}</Typography>
          </Paper>
        </Box>
      ))}
    </Box>
  );
}
