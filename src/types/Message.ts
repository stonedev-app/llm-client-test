/**
 * メッセージ
 * @property id メッセージID
 * @property text メッセージのテキスト
 * @property fromMe 自分の送信したメッセージであるか
 */
export interface Message {
  id: number;
  text: string;
  fromMe: boolean;
}
