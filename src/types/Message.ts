/**
 * メッセージ
 * @property id メッセージID
 * @property text メッセージのテキスト
 * @property fromMe 自分の送信したメッセージであるか
 * @property error エラーメッセージであるか
 */
export interface Message {
  id: number;
  text: string;
  fromMe: boolean;
  error: boolean;
}
