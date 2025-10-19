import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";

import { Textarea } from "./components/ui/textarea";
import { Button } from "./components/ui/button";

export const App = () => {
  // 入力メッセージ
  const [inputMessage, setInputMessage] = useState<string>("");
  // 送信ボタン無効
  const [sendBtnDisabled, setSendBtnDisabled] = useState<boolean>(true);

  // 入力メッセージが変更された場合
  useEffect(() => {
    // 入力メッセージ欄に何か入力されていれば、送信ボタンを有効にする
    setSendBtnDisabled(!inputMessage.trim());
  }, [inputMessage]);

  // 入力メッセージ送信処理
  const sendMessage = async () => {
    // TODO: メッセージ送信処理を実装すること
    console.log(await invoke("send_message", { message: inputMessage }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-gray-50">
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        <Textarea
          placeholder="Type your message here."
          className="bg-white"
          value={inputMessage}
          onChange={(e) => {
            setInputMessage(e.currentTarget.value);
          }}
        />
        <div className="flex justify-end">
          <Button
            variant="outline"
            disabled={sendBtnDisabled}
            onClick={async () => {
              await sendMessage();
            }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
