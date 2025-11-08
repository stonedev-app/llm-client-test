import { invoke } from "@tauri-apps/api/core";
import { Dispatch, SetStateAction } from "react";
import { Message } from "../../types/Message";

export const requestApiChat = async (
  messages: Message[],
  setMessages: Dispatch<SetStateAction<Message[]>>
): Promise<void> => {
  try {
    const resMessage: string = await invoke("ollama_api_chat", {
      content: messages[messages.length - 1].text,
    });
    // メッセージ配列に応答メッセージを追加して再設定
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: resMessage,
        fromMe: false,
      },
    ]);
  } catch (err) {
    // メッセージ配列にエラーメッセージを追加して再設定
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: err as string,
        fromMe: false,
      },
    ]);
  }
};
