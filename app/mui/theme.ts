import { createTheme, colors, Theme, PaletteMode } from "@mui/material";

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
