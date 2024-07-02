import { CacheProvider } from "@emotion/react";

import type { PaletteMode } from "@mui/material";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import initTheme from "./theme";
import createCache from "@emotion/cache";
import React, { useCallback, useMemo } from "react";
import ColorModeContext from "./ColorModeContext";

function createEmotionCache() {
  return createCache({ key: "css" });
}

export function MuiProvider({ children }: { children: React.ReactNode }) {
  const cache = createEmotionCache();

  const prefersLight = useMediaQuery("(prefers-color-scheme: light)");
  // @TODO load preferences
  const [mode, setMode] = React.useState<PaletteMode>(
    prefersLight ? "light" : "dark"
  );
  const toggleColorMode = useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
    // @TODO save preferences
  }, []);
  const theme = useMemo(() => initTheme({ mode }), [mode]);

  return (
    <CacheProvider value={cache}>
      <ColorModeContext.Provider value={{ toggleColorMode }}>
        <ThemeProvider theme={theme}>
          <CssBaseline enableColorScheme />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
}
