import { invoke } from "@tauri-apps/api/core";

import { ApiMessage } from "../../../types/Message";
import { Commands } from "../../../tauri/constants";
import { LLMApiError, normalizeLLMApiError } from "../../../types/LLMApiError";
import { Err, Ok, Result } from "../../../types/Result";

/**
 * Ollama API チャットリクエスト関数
 *
 * @param model モデル名
 * @param messages メッセージ配列
 * @returns チャット応答メッセージ、もしくはLLMApiError
 */
export const requestApiChat = async (
  model: string,
  messages: ApiMessage[]
): Promise<Result<string, LLMApiError>> => {
  try {
    // LLMリクエスト処理を呼び出す
    const resMessage = await invoke<string>(Commands.ollamaApiChat, {
      model,
      messages,
    });
    return Ok(resMessage);
  } catch (err) {
    // LLMApiError型に正規化する
    const llmErr = normalizeLLMApiError(err);
    return Err(llmErr);
  }
};
