import { Box } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import OngoingAppBar from "./components/OngoingAppBar";

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

  return json({
    user,
  });
}

export default function Ongoing() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <OngoingAppBar />
    </Box>
  );
}
