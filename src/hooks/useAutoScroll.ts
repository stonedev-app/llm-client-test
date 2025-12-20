import { useEffect, RefObject } from "react";
import { UiMessage } from "../types/Message";

/**
 * 自動スクロールフック
 * メッセージが追加されたら最後のメッセージまで自動スクロール
 *
 * @param lastMessageRef 最後のメッセージ要素への参照
 * @param messages メッセージ配列（変更検知用）
 */
export function useAutoScroll(
  lastMessageRef: RefObject<HTMLDivElement | null>,
  messages: UiMessage[]
): void {
  useEffect(() => {
    // 最後のメッセージにまでスクロール
    lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, lastMessageRef]);
}
