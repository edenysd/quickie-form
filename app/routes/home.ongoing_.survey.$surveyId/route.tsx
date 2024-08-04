import { Alert, Box, Chip, Typography } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import SurveyDetailAppBar from "./components/SurveyDetailAppBar";
import { getSurveyById } from "~/supabase/models/surveys/surveys";

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

  return json({ surveyDetails, user });
}

export default function Templates() {
  const loaderData = useLoaderData<typeof loader>();

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
        gap={1}
        sx={{
          px: 1,
        }}
      >
        <Box display={"flex"} gap={2}>
          <Typography variant="h4" fontFamily={"Virgil"}>
            {loaderData.surveyDetails.data?.survey_label}{" "}
          </Typography>
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
        </Box>
        <Typography variant="body1">
          Created at{" "}
          <b>
            {new Date(
              loaderData.surveyDetails.data!.created_at
            ).toLocaleString()}
          </b>
        </Typography>
      </Box>
    </Box>
  );
}
