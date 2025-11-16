import { invoke } from "@tauri-apps/api/core";
import { Dispatch, SetStateAction } from "react";

import { Message } from "../../types/Message";
import { Commands } from "../../tauri/constants";
import { LLMApiError } from "../../types/LLMApiError";

export const requestApiChat = async (
  messages: Message[],
  setMessages: Dispatch<SetStateAction<Message[]>>
): Promise<void> => {
  try {
    // LLMリクエスト処理を呼び出す
    const resMessage = await invoke<string>(Commands.ollamaApiChat, {
      messages,
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
    const llmErr = err as LLMApiError;
    // メッセージ配列にエラーメッセージを追加して再設定
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        text: llmErr.message,
        fromMe: false,
        error: true,
      },
    ]);
  }
};
