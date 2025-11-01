import CssBaseline from "@mui/material/CssBaseline";
import { ChatPage } from "./pages/ChatPage";

export function App() {
  return (
    <>
      {/* リセットCSSを適用 */}
      <CssBaseline />
      <ChatPage />
    </>
  );
}
