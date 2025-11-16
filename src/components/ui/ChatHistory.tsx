import { Box, Paper, Typography } from "@mui/material";
import { open } from "@tauri-apps/plugin-shell";
import Markdown from "react-markdown";

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
export function ChatHistory({
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
            {/* ユーザーの入力かLLMの応答であるか */}
            {msg.fromMe ? (
              // ユーザーの入力はただの文字列扱いとする
              <Typography
                variant="body2"
                // 改行は改行扱いで表示、長い文字列は強制的に折り返し
                sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
              >
                {msg.text}
              </Typography>
            ) : (
              // LLMからの応答は、マークダウンとして解釈する
              <Box
                sx={{
                  // 長い文字列を強制的に折り返し
                  wordBreak: "break-word",
                  // Typographyのvariant="body2"相当のフォントサイズを設定
                  fontSize: "0.875rem",
                  // Typographyのvariant="body2"相当の行間を設定
                  lineHeight: 1.43,
                  // マークダウンの不要なマージンを除去
                  "& *": { margin: 0 },
                }}
              >
                <Markdown
                  components={{
                    // アンカータグを上書きする
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        onClick={async (e) => {
                          // アプリ内遷移を止める
                          e.preventDefault();
                          if (href) {
                            try {
                              // 外部ブラウザで開く
                              await open(href);
                            } catch (err) {
                              console.error("リンクを開けませんでした:", err);
                            }
                          }
                        }}
                        style={{
                          color: "#1976d2",
                        }}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {msg.text}
                </Markdown>
              </Box>
            )}
          </Paper>
        </Box>
      ))}
    </Box>
  );
}
