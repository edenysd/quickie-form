import { Box } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import AppAppBar from "./components/AppAppBar";
import ChatBox from "./components/ChatBox";
import { parseWithZod } from "@conform-to/zod";
import z from "zod";

export const meta: MetaFunction = () => {
  return [
    { title: "Home" },
    {
      name: "description",
      content: "Home section for Quickie Form service.",
    },
  ];
};

export const formSchema = z.object({
  prompt: z.string({ required_error: "Prompt is required" }),
});

export async function action({ request }: LoaderFunctionArgs) {
  const headers = new Headers();
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const supabase = supabaseServerClient(cookies, headers);

  const { error } = await supabase.auth.getUser();

  if (error) {
    return redirect("/sign-in");
  }

  const formData = await request.formData();
  const data = parseWithZod(formData, { schema: formSchema });
  console.log(data);

  return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const headers = new Headers();
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const supabase = supabaseServerClient(cookies, headers);

  const { error } = await supabase.auth.getUser();

  if (error) {
    return redirect("/sign-in");
  }

  return null;
}

export default function Home() {
  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <AppAppBar />
      <ChatBox />
    </Box>
  );
}
