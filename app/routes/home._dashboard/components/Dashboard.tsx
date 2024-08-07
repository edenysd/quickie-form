import { Box, Typography } from "@mui/material";
import TotalTemplatesCard from "./cards/TotalTemplatesCard";
import { Masonry } from "@mui/lab";
import RunningSurveysCard from "./cards/RunningSurveysCard";
import TotalCommunityTemplatesCard from "./cards/TotalCommunityTemplatesCard";
import ClosedSurveysCard from "./cards/ClosedSurveysCard";

export default function Dashboard() {
  return (
    <Box width={"100%"} p={1}>
      <Typography variant="h3" fontFamily={"Virgil"}>
        Dashboard
      </Typography>
      <Masonry
        defaultColumns={3}
        defaultHeight={200}
        defaultSpacing={2}
        columns={{ xs: 2, sm: 3, md: 4, lg: 4, xl: 4 }}
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
