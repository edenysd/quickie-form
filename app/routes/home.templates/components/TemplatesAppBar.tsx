import { KeyboardArrowDownOutlined } from "@mui/icons-material";
import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { Link } from "@remix-run/react";
import { useCallback, useState } from "react";
import AppAppBar from "~/components/AppAppBar";

function TemplatesAppBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = useCallback((e) => {
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppAppBar>
      <Box display={"flex"} justifyContent={"space-between"} flexGrow={1}>
        <Typography fontFamily={"Virgil"} alignContent={"center"}>
          Templates
        </Typography>
        <Box display={"flex"}>
          <Button
            size="small"
            aria-haspopup="true"
            disableElevation
            onClick={handleClick}
            endIcon={<KeyboardArrowDownOutlined />}
          >
            New
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={handleClose}
              component={Link}
              to={"/home/new-form"}
            >
              Form Template
            </MenuItem>
            <MenuItem disabled>UX Bot Template</MenuItem>
          </Menu>
        </Box>
      </Box>
    </AppAppBar>
  );
}

export default TemplatesAppBar;
