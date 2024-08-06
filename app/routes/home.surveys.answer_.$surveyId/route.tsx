import { Box, Typography } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { getSurveyById } from "~/supabase/models/surveys/surveys";
import { getFormTemplateById } from "~/supabase/models/form-templates/forms";
import supabasePrivateServerClient from "~/supabase/supabasePrivateServerClient";
import FullFormComponent from "../../components/FullFormComponent";
import { parseWithZod } from "@conform-to/zod";
import { createFormValidationSchema } from "~/utils/createFormSchema";
import { fromFormPlainNamesToObject } from "~/utils/fromFormPlainNamesToObject";
import { createSummaryFormObject } from "~/utils/createSummaryFormObject";
import { addFormObjectToSummaryObject } from "~/utils/addFormObjectToSummaryObject";
import { insertSurveyResponse } from "~/supabase/models/survey-responses/surveysResponses";
import type { Json } from "~/supabase/database.types";

export const meta: MetaFunction = () => {
  return [
    { title: "Survey" },
    {
      name: "description",
      content: "Answer the current survey",
    },
  ];
};

export async function action({ request, params }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === null) {
    return null;
  }

  if (_action === "finish-survey") {
    const privateSupabase = supabasePrivateServerClient();

    const surveyDetails = await getSurveyById({
      supabaseClient: privateSupabase,
      surveyId: params.surveyId!,
    });

    const formTemplate = await getFormTemplateById({
      supabaseClient: privateSupabase,
      templateId: surveyDetails.data!.template_id!.toString(),
    });

    const formConfig = formTemplate.data?.config;
    const formValidationSchema = createFormValidationSchema(formConfig!);

    const data = parseWithZod<typeof formValidationSchema>(formData, {
      schema: formValidationSchema,
    });
    if (data.status !== "success") {
      return data.reply();
    }
    const structuredFormData = fromFormPlainNamesToObject(
      data.value,
      formConfig!
    );
    await insertSurveyResponse({
      surveyId: params.surveyId!,
      dataEntry: structuredFormData as Json,
      supabaseClient: privateSupabase,
    });
    const baseSummaryFormObject = createSummaryFormObject(formConfig!);

    const updatedSumaryFormObjectFrequencies = addFormObjectToSummaryObject(
      formConfig!,
      baseSummaryFormObject,
      structuredFormData
    );

    console.log(JSON.stringify(updatedSumaryFormObjectFrequencies));
  }

  return null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const privateSupabase = supabasePrivateServerClient();
  const surveyDetails = await getSurveyById({
    supabaseClient: privateSupabase,
    surveyId: params.surveyId!,
  });

  const formTemplate = await getFormTemplateById({
    supabaseClient: privateSupabase,
    templateId: surveyDetails.data!.template_id!.toString(),
  });

  const formConfig = formTemplate.data?.config;

  const surveyLabel = surveyDetails.data?.survey_label;

  return json({ formConfig, surveyLabel });
}

export default function Templates() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      py={6}
      width={"100%"}
      gap={3}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        width={"100%"}
        maxWidth={"1200px"}
        gap={3}
        sx={{
          px: {
            md: 5,
            sm: 3,
            xs: 1,
          },
        }}
      >
        <Typography
          variant="h3"
          fontFamily={"Virgil"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
        >
          {loaderData.surveyLabel}
        </Typography>
        <FullFormComponent formConfig={loaderData.formConfig} />
      </Box>
    </Box>
  );
}
