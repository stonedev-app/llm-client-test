/**
 * LLM API エラー
 * @property kind エラー種別
 * @property message エラーメッセージ
 */
export interface LLMApiError {
  kind: LLMApiErrorTypeEnum;
  message: string;
}

/**
 * エラー種別列挙体
 */
export enum LLMApiErrorTypeEnum {
  /** DNSエラー、プロキシ接続拒否などのネットワークエラー */
  Network = "network",
  /** HTTPステータス異常 (LLM のエラー) */
  Http = "http",
  /** 受信中エラー */
  Receive = "receive",
  /** JSON 解析失敗などのパースエラー */
  Parse = "parse",
  /** その他の不明なエラー */
  Unknown = "unknown",
}

/**
 * LLM API エラーを正規化する
 * @param err 不明なエラーオブジェクト
 * @returns 正規化された LLMApiError
 */
export const normalizeLLMApiError = (err: unknown): LLMApiError => {
  // LLMApiError型の場合はそのまま返す
  if (typeof err === "object" && err !== null) {
    const maybeError = err as LLMApiError;
    if (
      Object.values(LLMApiErrorTypeEnum).includes(maybeError.kind) &&
      typeof maybeError.message === "string"
    ) {
      return maybeError;
    }
  }
  // それ以外は不明なエラーとして扱う
  return {
    kind: LLMApiErrorTypeEnum.Unknown,
    message: String(err),
  };
};
