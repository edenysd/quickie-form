import { Box, Button, Chip, Typography } from "@mui/material";
import { Link, useLoaderData } from "@remix-run/react";
import type { loader } from "../route";
import { SURVEY_CONFIGS } from "~/routes/home.templates/components/dialogs/RunSurveyWithFormTemplateDialog";
import { KeyboardArrowLeftOutlined } from "@mui/icons-material";

export default function HeaderSurveyDetail() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      width={"100%"}
      gap={1}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography variant="h3" fontFamily={"Virgil"}>
          {loaderData.surveyDetails.data?.survey_label}{" "}
        </Typography>
        <Box>
          <Button
            startIcon={<KeyboardArrowLeftOutlined />}
            color="secondary"
            variant="outlined"
            component={Link}
            to="/home/ongoing"
            sx={{ borderRadius: "30px" }}
          >
            Go to Ongoing
          </Button>
        </Box>
      </Box>
      <Box display={"flex"} gap={1}>
        <Chip
          color={
            loaderData.surveyDetails.data!.survey_status == "open"
              ? "success"
              : "error"
          }
          variant="filled"
          label={
            loaderData.surveyDetails.data!.survey_status == "open"
              ? "Open"
              : "Closed"
          }
        />
        <Chip
          variant="outlined"
          label={SURVEY_CONFIGS[loaderData.surveyDetails.data!.survey_variant!]}
        />
      </Box>
      <Typography variant="body1">
        Created at{" "}
        <b>
          {new Date(loaderData.surveyDetails.data!.created_at).toLocaleString()}
        </b>
      </Typography>
    </Box>
  );
}
