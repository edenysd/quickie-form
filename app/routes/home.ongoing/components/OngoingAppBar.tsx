import { Box } from "@mui/material";
import AppAppBar from "~/components/AppAppBar";

function OngoingAppBar() {
  return (
    <AppAppBar>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        flexGrow={1}
        fontFamily={"Virgil"}
      >
        Ongoing
      </Box>
    </AppAppBar>
  );
}

export default OngoingAppBar;
