import * as React from "react";
import { TextField, IconButton, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatInput() {
  const [message, setMessage] = React.useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    console.log("送信:", message);
    setMessage("");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1.5,
        display: "flex",
        alignItems: "center",
        borderRadius: "24px",
      }}
    >
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
      <IconButton
        onClick={handleSend}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
}
