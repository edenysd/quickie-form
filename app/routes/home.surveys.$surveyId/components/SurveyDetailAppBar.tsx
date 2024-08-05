import { Box, Typography } from "@mui/material";
import AppAppBar from "~/components/AppAppBar";

function SurveyDetailAppBar() {
  return (
    <AppAppBar>
      <Box display={"flex"} justifyContent={"space-between"} flexGrow={1}>
        <Typography fontFamily={"Virgil"} alignContent={"center"}>
          Survey Details
        </Typography>
      </Box>
    </AppAppBar>
  );
}

export default SurveyDetailAppBar;
