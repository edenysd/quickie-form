import { Box } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import DashboardAppBar from "./components/DashboardAppBar";

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

  return json({
    user,
  });
}

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <DashboardAppBar />
    </Box>
  );
}
