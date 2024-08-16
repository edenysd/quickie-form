import { Box, Typography } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { getSurveyById } from "~/supabase/models/surveys/surveys";
import { getFormTemplateById } from "~/supabase/models/form-templates/forms";
import { getSurveySummaryBySurveyId } from "~/supabase/models/survey-summaries/surveysSummaries";
import supabasePrivateServerClient from "~/supabase/supabasePrivateServerClient";
import SurveyStatistics from "../home.surveys.$surveyId/components/SurveyStatistics";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: `Survey Statistics | ${data.surveyDetails.data.survey_label}` },
    {
      name: "description",
      content: "See all statistics about a specific survey",
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const superSupabase = supabasePrivateServerClient();

  const surveyDetails = await getSurveyById({
    supabaseClient: superSupabase,
    surveyId: params.surveyId!,
  });

  const formTemplate = await getFormTemplateById({
    supabaseClient: superSupabase,
    templateId: surveyDetails.data!.template_id!.toString(),
  });

  const surveySummary = await getSurveySummaryBySurveyId({
    surveyId: params.surveyId!,
    supabaseClient: superSupabase,
  });

  if (!surveyDetails.data?.is_statistics_shared) {
    return redirect("/404");
  }

  return json({
    surveyDetails,
    surveySummary,
    formTemplate,
  });
}

export default function SharedSurveyStatistics() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      pt={10}
      pb={6}
      width={"100%"}
      gap={3}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        width={"100%"}
        maxWidth={"1200px"}
        gap={2}
        sx={{
          px: {
            md: 5,
            sm: 3,
            xs: 1,
          },
        }}
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

        <SurveyStatistics />
      </Box>
    </Box>
  );
}
