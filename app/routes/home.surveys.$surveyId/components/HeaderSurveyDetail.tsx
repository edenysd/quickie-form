import { Box, Button, Chip, Typography } from "@mui/material";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "../route";
import { SURVEY_CONFIGS } from "~/routes/home.templates/components/dialogs/RunSurveyWithFormTemplateDialog";
import { KeyboardArrowLeftOutlined } from "@mui/icons-material";

export default function HeaderSurveyDetail() {
  const loaderData = useLoaderData<typeof loader>();
  const isSurveyOpen = loaderData.surveyDetails.data!.survey_status === "open";
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
        justifyContent={"space-between"}
        alignItems={"center"}
        flexWrap={"wrap"}
      >
        <Typography
          variant="h3"
          fontFamily={"Virgil"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
        >
          {loaderData.surveyDetails.data?.survey_label}{" "}
        </Typography>
      </Box>

      <Box display={"flex"} justifyContent={"space-between"}>
        <Box display={"flex"} gap={1}>
          <Chip
            color={isSurveyOpen ? "success" : "error"}
            variant="filled"
            label={isSurveyOpen ? "Open" : "Closed"}
          />
          <Chip
            variant="outlined"
            label={
              SURVEY_CONFIGS[loaderData.surveyDetails.data!.survey_variant!]
            }
          />
        </Box>

        <Button
          size="small"
          sx={{
            display: {
              xs: "none",
              sm: "flex",
            },
          }}
          startIcon={<KeyboardArrowLeftOutlined />}
          color="secondary"
          variant="outlined"
          component={Link}
          to={isSurveyOpen ? "/home/ongoing" : "/home/records"}
        >
          {isSurveyOpen ? "Go to Ongoing" : "Go to Records"}
        </Button>
      </Box>
      <Typography variant="body1">
        Created at{" "}
        <b>
          {new Date(loaderData.surveyDetails.data!.created_at).toLocaleString()}
        </b>
      </Typography>
      {!isSurveyOpen ? (
        <Typography variant="body1">
          Closed at{" "}
          <b>
            {new Date(
              loaderData.surveyDetails.data!.closed_at!
            ).toLocaleString()}
          </b>
        </Typography>
      ) : null}
    </Box>
  );
}
