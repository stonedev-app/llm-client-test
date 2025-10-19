import { useState, useEffect } from "react";

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

  return (
    <div className="flex min-h-screen items-center justify-center p-8 bg-gray-100">
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
          <Button variant="outline" disabled={sendBtnDisabled}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
