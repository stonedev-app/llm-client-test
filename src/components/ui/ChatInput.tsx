import { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

/**
 * チャット入力プロパティ
 * @property onSend 送信イベントハンドラ
 * @property isSending 送信中
 */
interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  isSending: boolean;
}

/**
 * チャット入力コンポーネント
 *
 * @param props チャット入力プロパティ
 * @param props.onSend 送信イベントハンドラ
 * @param props.isSending 送信中
 * @returns JSX要素
 */
export function ChatInput({ onSend, isSending }: ChatInputProps) {
  // メッセージ
  const [message, setMessage] = useState("");

  // メッセージ送信イベント
  const handleSend = () => {
    // メッセージが空の場合は処理を中断
    if (!message.trim()) return;
    // メッセージクリア
    setMessage("");
    // メッセージ送信
    onSend(message);
  };

  return (
    // テキストフィールド装飾
    <Paper
      elevation={3}
      sx={{
        p: 1.5,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        borderRadius: 3,
        width: "100%",
      }}
    >
      {/* テキストフィールド。outlinedの枠線は無効化 */}
      <TextField
        fullWidth
        multiline
        maxRows={3}
        placeholder={isSending ? "応答待機中..." : "メッセージを入力..."}
        disabled={isSending}
        variant="outlined"
        size="small"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // Shift + Enterの場合はメッセージ送信
            if (e.shiftKey) {
              e.preventDefault(); // 改行コード入力は抑制
              handleSend();
            }
            // Enterキー入力の場合は改行
          }
        }}
        sx={{
          "& fieldset": { border: "none" },
        }}
      />
      {/* アイコンボタンを右寄せ */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {/* アイコンボタン */}
        <IconButton
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          {isSending ? (
            // ローディングアイコン
            <CircularProgress size={22} color="inherit" />
          ) : (
            // 送信アイコン
            <SendIcon />
          )}
        </IconButton>
      </Box>
    </Paper>
  );
}
