import { Box } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import AppAppBar from "./components/AppAppBar";
import ChatBox from "./components/ChatBox";
import { parseWithZod } from "@conform-to/zod";
import z from "zod";
import {
  getChatSession,
  getLastMessageFromCachedChatSession,
} from "./bot/chat";
import type { Content } from "@google/generative-ai";

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

  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || user === null) {
    return redirect("/sign-in");
  }

  const formData = await request.formData();
  const data = parseWithZod(formData, { schema: formSchema });
  if (data.status !== "success") {
    return data.reply();
  }
  const prompt = data.value.prompt;

  const fetchHistory = async () => {
    const response = await supabase
      .from("Forms")
      .select("history")
      .eq("owner", user.id)
      .limit(1)
      .maybeSingle();

    if (response.error) throw response.error;
    return (response.data?.history || []) as Content[];
  };

  const chatSession = await getChatSession({ fetchHistory, id: "1" });
  const result = await chatSession.sendMessage(prompt);

  return json(result);
}

export async function loader({ request }: LoaderFunctionArgs) {
  const headers = new Headers();
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const supabase = supabaseServerClient(cookies, headers);

  const { error } = await supabase.auth.getUser();

  if (error) {
    return redirect("/sign-in");
  }

  return json({
    history: await getLastMessageFromCachedChatSession("1"),
  });
}

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();
  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <AppAppBar />
      <ChatBox />
      <Box pt={10} pb={12}>
        {loaderData.history ? JSON.stringify(loaderData.history) : null}
      </Box>
    </Box>
  );
}
