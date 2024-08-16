import { Box, Chip, Typography } from "@mui/material";
import { useFetcher, useLoaderData } from "@remix-run/react";
import type { loader } from "../route";
import InputShareStatisticsLink from "./InputShareStatisticsLink";
import { ShareOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import SurveyStatistics from "./SurveyStatistics";

export const TOOGLE_SHARE_STATISTICS_ACTION = "toggle-share-statistics-action";

export default function SurveyStatisticsWithActions() {
  const loaderData = useLoaderData<typeof loader>();
  const isResultShared = !!loaderData.surveyDetails.data?.is_statistics_shared;

  const fetcher = useFetcher();
  const isPublishingSomeAction = fetcher.state !== "idle";

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      width={"100%"}
      gap={1}
    >
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        gap={2}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={1}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
        >
          <Box display={"flex"} alignItems={"center"} gap={1}>
            <Typography
              variant="h4"
              fontFamily={"Virgil"}
              overflow={"hidden"}
              textOverflow={"ellipsis"}
            >
              Results
            </Typography>
            {loaderData.user ? (
              <Chip
                label={isResultShared ? "Shared" : "Private"}
                variant="outlined"
                onDelete={() => {}}
                deleteIcon={<InputShareStatisticsLink />}
              />
            ) : null}
          </Box>

          {loaderData.user ? (
            <Box component={fetcher.Form} method="POST" m={0}>
              <LoadingButton
                loading={isPublishingSomeAction}
                size="small"
                variant="outlined"
                name="_action"
                value={TOOGLE_SHARE_STATISTICS_ACTION}
                type="submit"
                startIcon={<ShareOutlined />}
                color={isResultShared ? "error" : "primary"}
              >
                {isResultShared ? "Stop Sharing" : "Share Satistics"}
              </LoadingButton>
            </Box>
          ) : null}
        </Box>
        <SurveyStatistics />
      </Box>
    </Box>
  );
}
