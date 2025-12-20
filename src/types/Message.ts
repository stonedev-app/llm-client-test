/**
 * メッセージ基本情報
 * @property text メッセージのテキスト
 * @property fromMe 自分の送信したメッセージであるか
 */
interface BaseMessage {
  text: string;
  fromMe: boolean;
}

/**
 * UI表示用メッセージ
 * @property id メッセージID
 * @property error エラーメッセージであるか
 */
export interface UiMessage extends BaseMessage {
  id: number;
  error: boolean;
}

/**
 * API送信用メッセージ
 */
export interface ApiMessage extends BaseMessage {
  // ※基本情報のみ
  // id,errorはAPI送信時には不要
}
