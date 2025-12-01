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
}
