import React from "react";
import ReactDOM from "react-dom/client";
import { warn, debug, trace, info, error } from "@tauri-apps/plugin-log";
import { App } from "./App";

// ---- console フックを登録（アプリ起動時に一度だけ） ----
function forwardConsole(
  fnName: "log" | "debug" | "info" | "warn" | "error",
  logger: (message: string) => Promise<void>
) {
  const original = console[fnName];
  console[fnName] = (...args) => {
    // 元の console.xxx をそのまま動作させる
    original(...args);

    // args を文字列化して Tauri ログへ
    const msg = args
      .map((a) => (typeof a === "string" ? a : JSON.stringify(a, null, 2)))
      .join(" ");

    logger(msg);
  };
}

forwardConsole("log", trace);
forwardConsole("debug", debug);
forwardConsole("info", info);
forwardConsole("warn", warn);
forwardConsole("error", error);
// ---------------------------------------------------------

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
