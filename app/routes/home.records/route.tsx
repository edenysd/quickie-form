import { Box, Typography } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import RecordsAppBar from "./components/RecordsAppBar";
import PastSurveysDataGrid from "./components/PastSurveysDataGrid";
import {
  closeSurveyById,
  getAllUserClosedSurveys,
} from "~/supabase/models/surveys/surveys";
import { CLOSE_SURVEY_BY_ID_ACTION } from "../../components/CloseSurveyDialog";

export const meta: MetaFunction = () => {
  return [
    { title: "Ongoing" },
    {
      name: "description",
      content:
        "Control all your ongoing surveys, experiments or any running resource.",
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
  const _action = formData.get("_action");

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

export async function loader({ request }: LoaderFunctionArgs) {
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

  const userClosedSurveys = await getAllUserClosedSurveys({
    supabaseClient: supabase,
    user,
  });

  return json({
    user,
    userClosedSurveys,
  });
}

export default function Records() {
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
      <RecordsAppBar />
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        width={"100%"}
        maxWidth={"1200px"}
        gap={1}
        sx={{
          px: 1,
        }}
      >
        <Typography variant="h4" fontFamily={"Virgil"}>
          Past Surveys
        </Typography>
        <PastSurveysDataGrid />
      </Box>
    </Box>
  );
}
