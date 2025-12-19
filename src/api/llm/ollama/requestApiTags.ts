import { invoke } from "@tauri-apps/api/core";
import { Commands } from "../../../tauri/constants";
import { Err, Ok, Result } from "../../../types/Result";
import { LLMApiError, normalizeLLMApiError } from "../../../types/LLMApiError";

/**
 * APIから利用可能なモデル名一覧を取得する
 * @returns モデル名配列、もしくはLLMApiError
 */
export const requestApiTags = async (): Promise<
  Result<string[], LLMApiError>
> => {
  try {
    // LLMモデル一覧取得処理を呼び出す
    const modelNames = await invoke<string[]>(Commands.ollamaApiTags);
    // 成功したらモデル名リストを返す
    return Ok(modelNames);
  } catch (err) {
    // エラーを正規化して返す
    return Err(normalizeLLMApiError(err));
  }
};
