import { AppBar, Toolbar, Typography } from "@mui/material";

/**
 * ヘッダーコンポーネント
 * @returns JSX要素
 */
export function Header() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          LLM Client Test
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
