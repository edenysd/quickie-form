import { Box, Typography } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import OngoingAppBar from "./components/OngoingAppBar";
import SurveysDataGrid from "./components/SurveysDataGrid";
import { getAllUserRunningSurveys } from "~/supabase/models/surveys/surveys";

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

  const userRunningSurveys = await getAllUserRunningSurveys({
    supabaseClient: supabase,
    user,
  });

  return json({
    user,
    userRunningSurveys,
  });
}

export default function Ongoing() {
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
      <OngoingAppBar />
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
          Ongoing Surveys
        </Typography>
        <SurveysDataGrid />
      </Box>
    </Box>
  );
}
