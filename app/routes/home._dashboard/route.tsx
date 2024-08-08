import { Box } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import DashboardAppBar from "./components/DashboardAppBar";
import {
  getAllComunityFormTemplates,
  getAllUserFormTemplates,
} from "~/supabase/models/form-templates/forms";
import {
  getAllUserClosedSurveys,
  getAllUserRunningSurveys,
} from "~/supabase/models/surveys/surveys";
import TutorialSteps from "./components/TutorialSteps";
import Status from "./components/Status";

export const meta: MetaFunction = () => {
  return [
    { title: "Home" },
    {
      name: "description",
      content: "Home section for Quickie Form service.",
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

  if (_action == "logout") {
    await supabase.auth.signOut();
    redirect("/sign-in");
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

  const userFormTemplates = await getAllUserFormTemplates({
    supabaseClient: supabase,
    user,
  });

  const comunityFormTemplates = await getAllComunityFormTemplates({
    supabaseClient: supabase,
  });

  const userRunningSurveys = await getAllUserRunningSurveys({
    supabaseClient: supabase,
    user,
  });

  const userClosedSurveys = await getAllUserClosedSurveys({
    supabaseClient: supabase,
    user,
  });

  return json({
    userFormTemplates,
    userRunningSurveys,
    comunityFormTemplates,
    userClosedSurveys,
    user,
  });
}

export default function Home() {
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
      px={{
        xs: 1,
        sm: 2,
      }}
      gap={3}
    >
      <DashboardAppBar />
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        width={"100%"}
        maxWidth={"1200px"}
        gap={7}
      >
        <TutorialSteps />
        <Status />
      </Box>
    </Box>
  );
}
