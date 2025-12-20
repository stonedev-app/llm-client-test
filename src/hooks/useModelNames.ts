import { useEffect, useState } from "react";
import { requestApiTags } from "../api/llm/ollama/requestApiTags";

/**
 * モデル名一覧取得フック
 * @returns { modelNames: モデル名一覧, error: エラーメッセージ }
 */
export function useModelNames(): {
  modelNames: string[];
  error: string | null;
} {
  // モデル名一覧を管理するステート
  const [modelNames, setModelNames] = useState<string[]>([]);
  // エラーステート
  const [error, setError] = useState<string | null>(null);

  // コンポーネントマウント時にモデル名一覧を取得
  useEffect(() => {
    // モデル名一覧をAPIから取得する非同期関数
    const fetchModelNames = async () => {
      const result = await requestApiTags();
      if (result.ok) {
        // モデル名一覧を設定
        setModelNames(result.value);
      } else {
        // エラーログを出力
        console.error("Failed to fetch model names:", result.error);
        // エラーメッセージを設定
        setError(result.error.message);
      }
    };

    // モデル名一覧を取得
    fetchModelNames();
  }, []);

  // フックの戻り値としてモデル名一覧とエラーを返す
  return { modelNames, error };
}
