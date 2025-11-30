import { useState, useEffect } from "react";
import { type } from "@tauri-apps/plugin-os";
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
  // macOS判定フラグ
  const [isMac, setIsMac] = useState(false);

  // コンポーネントマウント時にOS判定
  useEffect(() => {
    const osType = type();
    setIsMac(osType === "macos");
  }, []);

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
            // OSに応じた修飾キー判定
            const shouldSend = isMac ? e.metaKey : e.ctrlKey;
            // Macの場合はCmd+Enter、その他OSの場合はCtrl+Enterで送信
            if (shouldSend) {
              e.preventDefault(); // 改行コード入力は抑制
              handleSend();
            }
            // Enterキー単体入力の場合は改行
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
