import { Box, Grid } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import SurveyDetailAppBar from "./components/SurveyDetailAppBar";
import {
  closeSurveyById,
  getSurveyById,
  setSurveyShareStatisticsById,
} from "~/supabase/models/surveys/surveys";
import HeaderSurveyDetail from "./components/HeaderSurveyDetail";
import { getFormTemplateById } from "~/supabase/models/form-templates/forms";
import FormTemplateCard from "./components/cards/FormTemplateCard";
import { CLOSE_SURVEY_BY_ID_ACTION } from "~/components/CloseSurveyDialog";
import {
  getSurveySummaryBySurveyId,
  upsertSurveySummary,
} from "~/supabase/models/survey-summaries/surveysSummaries";
import TotalSurveyCard from "./components/cards/TotalSurveyCard";
import supabasePrivateServerClient from "~/supabase/supabasePrivateServerClient";
import LastCompletedCard from "./components/cards/LastCompletedCard";
import { TOOGLE_SHARE_STATISTICS_ACTION } from "./components/SurveyStatistics";
import SurveyResponses from "./components/SurveysResponses";
import { getAllSurveyResponseForSurveyId } from "~/supabase/models/survey-responses/surveysResponses";
import SurveyStatisticsWithActions from "./components/SurveyStatisticsWithActions";
import { generateInsights } from "~/generative-models/resume-insights/model";
import type { SummaryFormObjectType } from "~/utils/createSummaryFormObject";
import type { z } from "zod";
import type { generatedFormSchema } from "~/generative-models/form-template/schemas";
import type { StructuredFormDataEntry } from "~/utils/fromFormPlainNamesToObject";

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: `Survey Detail | ${data.surveyDetails.data.survey_label}` },
    {
      name: "description",
      content: "Details about a specific running survey",
    },
  ];
};

export async function action({ request, params }: LoaderFunctionArgs) {
  const headers = new Headers();
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const supabase = supabaseServerClient(cookies, headers);

  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || user === null) {
    return redirect("/sign-in");
  }

  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === null) {
    return null;
  }

  const routeSurveyId = params.surveyId!;

  if (_action === CLOSE_SURVEY_BY_ID_ACTION) {
    const surveyId = (formData.get("surveyId") as string) || routeSurveyId;

    if (surveyId) {
      const response = await closeSurveyById({
        surveyId,
        supabaseClient: supabase,
        user,
      });

      return json({
        error: response.error,
        sucess: true,
        _action: CLOSE_SURVEY_BY_ID_ACTION,
        surveyId,
      });
    } else {
      return json({
        error: TypeError("empty surveyId field not allowed"),
        sucess: false,
        _action: CLOSE_SURVEY_BY_ID_ACTION,
        surveyId,
      });
    }
  } else if (_action === TOOGLE_SHARE_STATISTICS_ACTION) {
    const surveyDetails = await getSurveyById({
      supabaseClient: supabase,
      surveyId: params.surveyId!,
    });

    const response = await setSurveyShareStatisticsById({
      surveyId: routeSurveyId,
      supabaseClient: supabase,
      user,
      newShareStatisticsValue: !surveyDetails.data?.is_statistics_shared,
    });
    return json({
      error: response.error,
      sucess: true,
      _action: TOOGLE_SHARE_STATISTICS_ACTION,
      surveyId: routeSurveyId,
    });
  }

  return null;
}

function allSummaryFieldsAreAlreadyGenerated(summary: SummaryFormObjectType) {
  let finishedFlag = true;
  Object.entries(summary).forEach((entrieSection) => {
    Object.entries(entrieSection[1]).forEach((entrieField) => {
      if (!entrieField[1]?.summaryMessage) {
        finishedFlag = false;
      }
    });
  });

  return finishedFlag;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const headers = new Headers();
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const supabase = supabaseServerClient(cookies, headers);
  const superSupabase = supabasePrivateServerClient();
  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect("/sign-in");
  }

  const surveyDetails = await getSurveyById({
    supabaseClient: supabase,
    surveyId: params.surveyId!,
  });

  const formTemplate = await getFormTemplateById({
    supabaseClient: supabase,
    templateId: surveyDetails.data!.template_id!.toString(),
  });

  let surveySummary = await getSurveySummaryBySurveyId({
    surveyId: params.surveyId!,
    supabaseClient: superSupabase,
  });

  const surveyResponses = await getAllSurveyResponseForSurveyId({
    surveyId: params.surveyId!,
    supabaseClient: superSupabase,
  });

  if (
    surveyDetails.data?.survey_status === "closed" &&
    surveySummary.data?.summary_data &&
    !allSummaryFieldsAreAlreadyGenerated(
      surveySummary.data?.summary_data as SummaryFormObjectType
    )
  ) {
    const insightsResponse = await generateInsights({
      summary: surveySummary.data!.summary_data as SummaryFormObjectType,
      formConfig: formTemplate.data?.config as z.infer<
        typeof generatedFormSchema
      >,
      surveyResponses: (surveyResponses.data?.map((surveyResponseRow) => {
        return surveyResponseRow.data_entry;
      }) || []) as StructuredFormDataEntry[],
    });

    const insightsObject = insightsResponse.object;

    const newSummaryData = structuredClone(
      surveySummary.data?.summary_data
    ) as SummaryFormObjectType;

    if (newSummaryData && insightsObject) {
      Object.entries(newSummaryData).forEach((entrieSummarySection) => {
        Object.entries(entrieSummarySection[1]).forEach(
          (entrieSummaryField) => {
            if (
              newSummaryData[entrieSummarySection[0]]![
                entrieSummaryField[0]
              ] === null
            ) {
              newSummaryData[entrieSummarySection[0]]![entrieSummaryField[0]] =
                { summaryMessage: null };
            }

            newSummaryData[entrieSummarySection[0]]![
              entrieSummaryField[0]
            ]!.summaryMessage =
              insightsObject[entrieSummarySection[0]][
                entrieSummaryField[0]
              ].summaryMessage;
          }
        );
      });
      await upsertSurveySummary({
        surveyId: params.surveyId!,
        surveySummaryId: surveySummary.data?.id,
        dataResume: newSummaryData,
        supabaseClient: superSupabase,
        totalEntries: surveySummary.data?.total_entries || 0,
      });

      surveySummary = await getSurveySummaryBySurveyId({
        surveyId: params.surveyId!,
        supabaseClient: superSupabase,
      });
    }
  }
  return json({
    surveyDetails,
    surveySummary,
    formTemplate,
    user,
    surveyResponses,
  });
}

export default function Templates() {
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
      <SurveyDetailAppBar />
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        width={"100%"}
        maxWidth={"1200px"}
        gap={8}
        sx={{
          px: {
            md: 5,
            sm: 3,
            xs: 1,
          },
        }}
      >
        <Box display={"flex"} flexDirection={"column"} gap={3}>
          <HeaderSurveyDetail />

          <Grid container spacing={2}>
            <FormTemplateCard />
            <TotalSurveyCard />
            <LastCompletedCard />
          </Grid>
        </Box>
        <SurveyStatisticsWithActions />
        <SurveyResponses />
      </Box>
    </Box>
  );
}
