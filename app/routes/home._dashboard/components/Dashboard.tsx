import { Box, Typography } from "@mui/material";
import TotalTemplatesCard from "./cards/TotalTemplatesCard";
import { Masonry } from "@mui/lab";
import RunningSurveysCard from "./cards/RunningSurveysCard";
import TotalCommunityTemplatesCard from "./cards/TotalCommunityTemplatesCard";
import ClosedSurveysCard from "./cards/ClosedSurveysCard";

export default function Dashboard() {
  return (
    <Box width={"100%"} p={1}>
      <Masonry
        defaultColumns={3}
        defaultHeight={200}
        defaultSpacing={2}
        columns={{ xs: 1, sm: 2, md: 3, lg: 5, xl: 5 }}
        sx={{ m: 0, width: "100%" }}
        spacing={2}
      >
        <TotalTemplatesCard />
        <RunningSurveysCard />
        <TotalCommunityTemplatesCard />
        <ClosedSurveysCard />
      </Masonry>
    </Box>
  );
}
