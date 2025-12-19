import { invoke } from "@tauri-apps/api/core";
import { Commands } from "../../../tauri/constants";
import { Result } from "../../../types/Result";
import { LLMApiError } from "../../../types/LLMApiError";

export const requestApiTags = async (): Promise<
  Result<string[], LLMApiError>
> => {
  try {
    // LLMモデル一覧取得処理を呼び出す
    const modelNames = await invoke<string[]>(Commands.ollamaApiTags);
    return { ok: true, value: modelNames };
  } catch (err) {
    // LLMApiError型にキャストする(※rustのエラーの型と型を合わせている)
    const llmErr = err as LLMApiError;
    return { ok: false, error: llmErr };
  }
};
