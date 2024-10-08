import { Box } from "@mui/material";
import AppAppBar from "~/components/AppAppBar";

function DashboardAppBar() {
  return (
    <AppAppBar>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        flexGrow={1}
        fontFamily={"Virgil"}
      >
        Home
      </Box>
    </AppAppBar>
  );
}

export default DashboardAppBar;
