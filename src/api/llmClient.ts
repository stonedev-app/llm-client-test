import { invoke } from "@tauri-apps/api/core";
import { Dispatch, SetStateAction } from "react";
import { Message } from "../types/Message";

export const requestLLM = async (
  message: string,
  setMessages: Dispatch<SetStateAction<Message[]>>
) => {
  const resMessage: string = await invoke("call_ollama", { prompt: message });
  // メッセージ配列に応答メッセージを追加して再設定
  setMessages((prev) => [
    ...prev,
    {
      id: prev.length + 1,
      text: resMessage,
      fromMe: false,
    },
  ]);
};
