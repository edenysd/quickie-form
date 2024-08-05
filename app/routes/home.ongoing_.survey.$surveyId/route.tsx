import {
  Box
} from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import SurveyDetailAppBar from "./components/SurveyDetailAppBar";
import { getSurveyById } from "~/supabase/models/surveys/surveys";
import HeaderSurveyDetail from "./components/HeaderSurveyDetail";
import { getFormTemplateById } from "~/supabase/models/form-templates/forms";
import FormTemplateCard from "./components/FormTemplateCard";

export const meta: MetaFunction = () => {
  return [
    { title: "Survey Detail" },
    {
      name: "description",
      content: "Details about a specific running survey",
    },
  ];
};

export async function action({ request }: LoaderFunctionArgs) {
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
  return null;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const headers = new Headers();
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const supabase = supabaseServerClient(cookies, headers);

  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect("/sign-in");
  }

  const surveyDetails = await getSurveyById({
    supabaseClient: supabase,
    user,
    surveyId: params.surveyId!,
  });

  const formTemplate = await getFormTemplateById({
    supabaseClient: supabase,
    user,
    templateId: surveyDetails.data!.template_id!.toString(),
  });

  return json({ surveyDetails, formTemplate, user });
}

export default function Templates() {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      pt={10}
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
        gap={3}
        sx={{
          px: {
            md: 5,
            sm: 3,
            xs: 1,
          },
        }}
      >
        <HeaderSurveyDetail />
        <FormTemplateCard />
      </Box>
    </Box>
  );
}
