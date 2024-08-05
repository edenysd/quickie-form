import { Box } from "@mui/material";
import AppAppBar from "~/components/AppAppBar";

function RecordsAppBar() {
  return (
    <AppAppBar>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        flexGrow={1}
        fontFamily={"Virgil"}
      >
        Records
      </Box>
    </AppAppBar>
  );
}

export default RecordsAppBar;
