import { Box } from "@mui/material";
import AppAppBar from "~/components/AppAppBar";

function TemplatesAppBar() {
  return (
    <AppAppBar>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        flexGrow={1}
        fontFamily={"Virgil"}
      >
        Reports
      </Box>
    </AppAppBar>
  );
}

export default TemplatesAppBar;