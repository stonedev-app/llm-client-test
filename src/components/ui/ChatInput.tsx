import { useState } from "react";
import { Box, TextField, IconButton, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

/**
 * チャット入力プロパティ
 * @property onSend 送信イベントハンドラ
 */
interface ChatInputProps {
  onSend: (message: string) => void;
}

/**
 * チャット入力コンポーネント
 *
 * @param props チャット入力プロパティ
 * @param props.onSend 送信イベントハンドラ
 * @returns JSX要素
 */
export default function ChatInput({ onSend }: ChatInputProps) {
  // メッセージ
  const [message, setMessage] = useState("");

  // メッセージ送信イベント
  const handleSend = () => {
    // メッセージが空の場合は処理を中断
    if (!message.trim()) return;
    // メッセージ送信
    onSend(message);
    // 改行コードをクリア
    setMessage(message.replace(/\n/g, ""));
    // メッセージクリア
    setMessage("");
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
        borderRadius: "12px",
      }}
    >
      {/* テキストフィールド。outlinedの枠線は無効化 */}
      <TextField
        fullWidth
        multiline
        maxRows={6}
        placeholder="メッセージを入力..."
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
          disabled={!message.trim()}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          {/* 送信アイコン */}
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
