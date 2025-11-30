import {
  AppBar,
  Toolbar,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

/**
 * ヘッダープロパティ
 * @property selectedModel 選択されたモデル
 * @property onModelChange モデル変更イベントハンドラ
 */
interface HeaderProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

/**
 * ヘッダーコンポーネント
 * @param props ヘッダープロパティ
 * @param props.selectedModel 選択されたモデル
 * @param props.onModelChange モデル変更イベントハンドラ
 * @returns JSX要素
 */
export function Header({ selectedModel, onModelChange }: HeaderProps) {
  // TODO: API経由で取得する
  // 利用可能なモデル一覧
  const availableModels = [
    { value: "gemma3:1b-it-qat", label: "Gemma3 1B" },
    { value: "llama2", label: "Llama2" },
    { value: "mistral", label: "Mistral" },
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* アプリタイトル */}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          LLM Client Test
        </Typography>

        {/* モデル選択セレクトボックス */}
        <FormControl variant="outlined" size="small" sx={{ minWidth: 180 }}>
          <Select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            sx={{
              color: "white",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.7)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          >
            {availableModels.map((model) => (
              <MenuItem key={model.value} value={model.value}>
                {model.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
}
