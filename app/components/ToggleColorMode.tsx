import { ModeNightRounded, WbSunnyRounded } from "@mui/icons-material";
import type { PaletteMode } from "@mui/material";
import { Box, Button } from "@mui/material";
import { startTransition } from "react";

interface ToggleColorModeProps {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

function ToggleColorMode({ mode, toggleColorMode }: ToggleColorModeProps) {
  return (
    <Box sx={{ maxWidth: "32px" }}>
      <Button
        variant="text"
        onClick={() => startTransition(toggleColorMode)}
        size="small"
        aria-label="button to toggle theme"
        sx={{ minWidth: "32px", height: "32px", p: "4px" }}
      >
        {mode === "dark" ? (
          <WbSunnyRounded fontSize="small" />
        ) : (
          <ModeNightRounded fontSize="small" />
        )}
      </Button>
    </Box>
  );
}

export default ToggleColorMode;
