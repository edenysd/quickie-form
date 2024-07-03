import * as React from "react";
import { Menu } from "@mui/icons-material";
import ToggleColorMode from "../../../mui/ToggleColorMode";
import type { Theme } from "@mui/material";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  MenuItem,
  Button,
  Drawer,
  Divider,
  useTheme,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ColorModeContext from "~/mui/ColorModeContext";

function AppAppBar() {
  const {
    palette: { mode },
  }: Theme = useTheme() as Theme;
  const { toggleColorMode } = React.useContext(ColorModeContext);

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="xs">
          <Toolbar
            variant="dense"
            sx={(theme) => ({
              display: "flex",
              p: 1,
              gap: 0.5,
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              borderRadius: "999px",
              color: "text.primary",
              bgcolor:
                theme.palette.mode === "light"
                  ? "rgba(255, 255, 255, 0.4)"
                  : "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(24px)",
              border: "1px solid",
              borderColor: "divider",
              boxShadow:
                theme.palette.mode === "light"
                  ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                  : "0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)",
            })}
          >
            <Box display={"flex"} justifyContent={"space-between"} flexGrow={1}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Box display={"flex"}>
                  <FormControlLabel
                    label="Assisted Mode"
                    control={<Switch defaultChecked color="success" />}
                  />
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                <ToggleColorMode
                  mode={mode}
                  toggleColorMode={toggleColorMode}
                />
                <Divider orientation="vertical" flexItem />
              </Box>
            </Box>
            <Box display={"flex"}>
              <Button
                variant="text"
                color="primary"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                sx={{ minWidth: "30px", p: "4px" }}
              >
                <Menu />
              </Button>
              <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  flexDirection={"column"}
                  sx={{
                    minWidth: "300px",
                    py: 2,
                    backgroundColor: "background.paper",
                    flexGrow: 1,
                  }}
                >
                  <Box>
                    <MenuItem>Next</MenuItem>
                  </Box>
                  <MenuItem>
                    <Button
                      color="primary"
                      variant="outlined"
                      component="a"
                      href="/material-ui/getting-started/templates/sign-in/"
                      target="_blank"
                      sx={{ width: "100%" }}
                    >
                      logout
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}

export default AppAppBar;
