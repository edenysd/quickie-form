import { Box, Typography } from "@mui/material";
import TotalTemplatesCard from "./cards/TotalTemplatesCard";
import { Masonry } from "@mui/lab";
import RunningSurveysCard from "./cards/RunningSurveysCard";
import ClosedSurveysCard from "./cards/ClosedSurveysCard";

export default function Status() {
  return (
    <Box
      width={{
        xs: "100%",
        md: "50%",
      }}
      pr={1}
    >
      <Typography variant="h5" fontFamily={"Virgil"}>
        Status
      </Typography>
      <Masonry
        defaultColumns={2}
        defaultHeight={200}
        defaultSpacing={1}
        columns={{ xs: 2, sm: 3, md: 2, lg: 2, xl: 2 }}
        sx={{ m: 0, width: "100%" }}
        spacing={1}
      >
        <TotalTemplatesCard />
        <RunningSurveysCard />
        <ClosedSurveysCard />
      </Masonry>
    </Box>
  );
}
