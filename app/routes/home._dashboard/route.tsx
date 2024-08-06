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
import { Masonry } from "@mui/lab";
import TotalTemplatesCard from "./components/cards/TotalTemplatesCard";
import TotalCommunityTemplatesCard from "./components/cards/TotalCommunityTemplatesCard";
import {
  getAllUserClosedSurveys,
  getAllUserRunningSurveys,
} from "~/supabase/models/surveys/surveys";
import RunningSurveysCard from "./components/cards/RunningSurveysCard";
import ClosedSurveysCard from "./components/cards/ClosedSurveysCard";

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
      gap={3}
    >
      <DashboardAppBar />
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        width={"100%"}
        maxWidth={"1200px"}
        gap={1}
        sx={{
          px: 1,
        }}
      >
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2}>
          <TotalTemplatesCard />
          <RunningSurveysCard />
          <TotalCommunityTemplatesCard />
          <ClosedSurveysCard />
        </Masonry>
      </Box>
    </Box>
  );
}
