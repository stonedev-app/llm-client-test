import { useState, useEffect } from "react";
import { listen } from "@tauri-apps/api/event";

import { Events } from "../tauri/constants";

/**
 * メッセージリスナーフック
 * Tauri のメッセージイベントをリッスンして受信中メッセージを管理
 *
 * @returns { message: 受信中メッセージ, reset: リセット関数 }
 */
export function useMessageListener(): {
  message: string;
  reset: () => void;
} {
  // 受信中メッセージ(ストリーミングメッセージ)
  const [receivingMessage, setReceivingMessage] = useState<string>("");

  useEffect(() => {
    // メッセージリスナー登録解除
    let unlisten: (() => void) | undefined;
    // アンマウントフラグ(※React.StrictMode対策)
    let canceled = false;

    // メッセージリスナーを登録する
    listen<string>(Events.receivingMessage, (event) => {
      // ストリーミングで受け取ったメッセージを受信中メッセージに追加する
      setReceivingMessage((prev) => prev + event.payload);
    }).then((fn) => {
      // マウント
      if (!canceled) {
        // unlistenに保持しておく
        unlisten = fn;
      }
      // アンマウント済み
      else {
        // メッセージリスナーを登録解除する
        fn();
      }
    });

    // チャット画面コンポーネントアンマウント時
    return () => {
      // アンマウント
      canceled = true;
      // メッセージリスナーを登録解除する
      if (unlisten) {
        unlisten();
      }
    };
  }, []);

  // メッセージをリセットする関数
  const reset = () => setReceivingMessage("");

  return { message: receivingMessage, reset };
}
