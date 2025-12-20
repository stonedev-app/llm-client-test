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
 * @property models 利用可能なモデル一覧
 * @property onModelChange モデル変更イベントハンドラ
 * @property disabled 選択不可フラグ
 */
interface HeaderProps {
  models: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  disabled: boolean;
}

/**
 * ヘッダーコンポーネント
 * @param props ヘッダープロパティ
 * @param props.models 利用可能なモデル一覧
 * @param props.selectedModel 選択されたモデル
 * @param props.onModelChange モデル変更イベントハンドラ
 * @param props.disabled 選択不可フラグ
 * @returns JSX要素
 */
export function Header({
  models,
  selectedModel,
  onModelChange,
  disabled,
}: HeaderProps) {
  return (
    <AppBar position="static" sx={{ backgroundColor: "primary.main" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* アプリタイトル */}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          LLM Client Test
        </Typography>

        {/* モデル選択セレクトボックス */}
        <FormControl
          variant="outlined"
          size="small"
          sx={{ minWidth: 180 }}
          disabled={disabled}
        >
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
            {models.map((model) => (
              <MenuItem key={model} value={model}>
                {model}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Toolbar>
    </AppBar>
  );
}
