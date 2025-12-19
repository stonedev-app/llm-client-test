/**
 * Result型定義
 * 成功時は{ ok: true; value: T }、失敗時は{ ok: false; error: E }の形をとる
 */
export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

/**
 * Result型の成功オブジェクト生成ユーティリティ関数
 * @param value 成功時の値
 * @returns Result型の成功オブジェクト
 */
export const Ok = <T, E = unknown>(value: T): Result<T, E> => ({
  ok: true,
  value,
});

/**
 * Result型の失敗オブジェクト生成ユーティリティ関数
 * @param error 失敗時のエラー
 * @returns Result型の失敗オブジェクト
 */
export const Err = <E, T = unknown>(error: E): Result<T, E> => ({
  ok: false,
  error,
});

/**
 * Result型のOk判定ユーティリティ関数
 * @param result 判定対象のResult型オブジェクト
 * @returns Resultが成功(ok)の場合にtrueを返す
 */
export const isOk = <T, E>(
  result: Result<T, E>
): result is { ok: true; value: T } => {
  return result.ok === true;
};
