import { useEffect, useState } from "react";
import { requestApiTags } from "../api/llm/ollama/requestApiTags";

/**
 * モデル名一覧取得フック
 * @returns { modelNames: モデル名一覧}
 */
export function useModelNames(): {
  modelNames: string[];
} {
  // モデル名一覧を管理するステート
  const [modelNames, setModelNames] = useState<string[]>([]);

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
      }
    };

    // モデル名一覧を取得
    fetchModelNames();
  }, []);

  // フックの戻り値としてモデル名一覧を返す
  return { modelNames };
}
