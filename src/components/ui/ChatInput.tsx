import { useState } from "react";
import { TextField, IconButton, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatInput() {
  // メッセージ
  const [message, setMessage] = useState("");

  // メッセージ送信イベント
  const handleSend = () => {
    // メッセージが空の場合は処理を中断
    if (!message.trim()) return;
    // TODO: メッセージ送信処理を実装すること
    console.log("送信:", message);
    // メッセージクリア処理
    setMessage("");
  };

  return (
    // テキストフィールド装飾
    <Paper
      elevation={3}
      sx={{
        p: 1.5,
        display: "flex",
        alignItems: "center",
        borderRadius: "24px",
      }}
    >
      {/* テキストフィールド。outlinedの枠線は無効化 */}
      <TextField
        fullWidth
        placeholder="メッセージを入力..."
        variant="outlined"
        size="small"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        sx={{
          "& fieldset": { border: "none" },
        }}
      />
      {/* アイコンボタン */}
      <IconButton
        onClick={handleSend}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        {/* 送信アイコン */}
        <SendIcon />
      </IconButton>
    </Paper>
  );
}
