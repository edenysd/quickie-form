import { Box, Typography } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import {
  closeSurveyById,
  getSurveyById,
} from "~/supabase/models/surveys/surveys";
import { getFormTemplateById } from "~/supabase/models/form-templates/forms";
import { CLOSE_SURVEY_BY_ID_ACTION } from "~/components/CloseSurveyDialog";
import supabasePrivateServerClient from "~/supabase/supabasePrivateServerClient";
import FullFormComponent from "./components/FullFormComponent";

export const meta: MetaFunction = () => {
  return [
    { title: "Survey" },
    {
      name: "description",
      content: "Answer the current survey",
    },
  ];
};

export async function action({ request }: LoaderFunctionArgs) {
  const supabase = supabasePrivateServerClient();

  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === null) {
    return null;
  }

  if (_action === CLOSE_SURVEY_BY_ID_ACTION) {
    const surveyId = formData.get("surveyId") as string;

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
  }

  return null;
}

export async function loader({ params }: LoaderFunctionArgs) {
  const privateSupabase = supabasePrivateServerClient();
  console.log("EEEE");
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
      py={10}
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
