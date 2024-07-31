import * as React from "react";
import {
  BookmarkOutlined,
  FlashOnOutlined,
  HomeOutlined,
  InsightsOutlined,
  Menu,
} from "@mui/icons-material";
import type { Theme } from "@mui/material";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Button,
  Drawer,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import ColorModeContext from "~/mui/ColorModeContext";
import { Form, Link } from "@remix-run/react";
import ToggleColorMode from "~/mui/ToggleColorMode";

function AppAppBar({ children }: React.PropsWithChildren) {
  const {
    palette: { mode },
  }: Theme = useTheme() as Theme;
  const { toggleColorMode } = React.useContext(ColorModeContext);
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const toggleDrawer = React.useCallback(
    (newOpen: boolean) => () => {
      setOpenDrawer(newOpen);
    },
    []
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="sm">
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
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"100%"}
            >
              <Box flexGrow={1}>{children}</Box>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <ToggleColorMode
                  mode={mode}
                  toggleColorMode={toggleColorMode}
                />
                <Divider orientation="vertical" flexItem />
                <Button
                  variant="text"
                  color="primary"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ minWidth: "30px", p: "4px" }}
                >
                  <Menu />
                </Button>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer anchor="right" open={openDrawer} onClose={toggleDrawer(false)}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          flexDirection={"column"}
          sx={{
            minWidth: "300px",
            backgroundColor: "background.paper",
            flexGrow: 1,
          }}
        >
          <nav>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/home">
                  <ListItemIcon>
                    <HomeOutlined />
                  </ListItemIcon>
                  <ListItemText>Home</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/templates">
                  <ListItemIcon>
                    <BookmarkOutlined />
                  </ListItemIcon>
                  <ListItemText>Templates</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/ongoing">
                  <ListItemIcon>
                    <FlashOnOutlined />
                  </ListItemIcon>
                  <ListItemText>Ongoing</ListItemText>
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/reports">
                  <ListItemIcon>
                    <InsightsOutlined />
                  </ListItemIcon>
                  <ListItemText>Reports</ListItemText>
                </ListItemButton>
              </ListItem>
            </List>
          </nav>
          <List>
            <ListItem>
              <Box
                component={Form}
                width={"100%"}
                m={0}
                method="POST"
                action="/home"
              >
                <Button
                  color="primary"
                  variant="outlined"
                  name="_action"
                  value="logout"
                  type="submit"
                  fullWidth
                >
                  logout
                </Button>
              </Box>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default AppAppBar;
