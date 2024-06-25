import type { Theme, PaletteMode } from "@mui/material";
import { createTheme, colors } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

// Create a theme instance.
const initTheme = ({
  mode = "dark",
}: {
  mode?: PaletteMode;
} = {}): Theme =>
  createTheme({
    palette: {
      mode: mode || "light",
      primary: {
        main: "#556cd6",
      },
      secondary: {
        main: "#19857b",
      },
      error: {
        main: colors.red.A400,
      },
    },
  });

export default initTheme;
