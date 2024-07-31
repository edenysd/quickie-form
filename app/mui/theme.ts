import type { Theme, PaletteMode } from "@mui/material";
import { createTheme, colors, responsiveFontSizes } from "@mui/material";
import Virgil from "./fonts/virgil.woff2";

// Create a theme instance.
const initTheme = ({
  mode = "dark",
}: {
  mode?: PaletteMode;
} = {}): Theme =>
  responsiveFontSizes(
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
      components: {
        MuiCssBaseline: {
          styleOverrides: `
          @font-face {
            font-family: 'Virgil';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
            src: local('Virgil'), local('Virgil-Regular'), url(${Virgil}) format('woff2');
            unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
          }
        `,
        },
      },
    })
  );
export default initTheme;
