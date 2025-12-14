import { invoke } from "@tauri-apps/api/core";
import { Dispatch, SetStateAction } from "react";

import { Message } from "../../../types/Message";
import { Commands } from "../../../tauri/constants";
import { LLMApiError, LLMApiErrorTypeEnum } from "../../../types/LLMApiError";

/**
 * Ollama API チャットリクエスト関数
 *
 * @param model モデル名
 * @param messages メッセージ配列
 * @param setMessages メッセージ配列設定関数
 * @param systemError システムエラー設定関数
 */
export const requestApiChat = async (
  model: string,
  messages: Message[],
  setMessages: Dispatch<SetStateAction<Message[]>>,
  systemError: Dispatch<SetStateAction<string | null>>
): Promise<void> => {
  try {
    // LLMリクエスト処理を呼び出す
    const resMessage = await invoke<string>(Commands.ollamaApiChat, {
      model,
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
    // LLMApiError型にキャストする(※rustのエラーの型と型を合わせている)
    const llmErr = err as LLMApiError;
    // LLMApiエラーの場合
    if (llmErr.kind === LLMApiErrorTypeEnum.Http) {
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
    // その他ネットワークエラーなどの場合
    else {
      // システムエラーメッセージ設定する
      systemError(llmErr.message);
    }
  }
};
