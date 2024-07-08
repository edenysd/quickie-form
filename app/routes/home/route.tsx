import { Box } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import AppAppBar from "./components/AppAppBar";
import ChatBox, { promptSchema } from "./components/ChatBox";
import { parseWithZod } from "@conform-to/zod";
import {
  getChatSession,
  getLastMessageFromCachedChatSession,
} from "./bot/chat";
import type { Content } from "@google/generative-ai";
import { generatedFormSchema } from "./bot/schemas";
import FormAssistedPreview from "./components/FormAssistedPreview";

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
  const data = parseWithZod(formData, { schema: promptSchema });
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

  const chatSession = await getChatSession({ fetchHistory, id: "local-saved" });
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
    formConfig: await getLastMessageFromCachedChatSession("local-saved"),
  });
}

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();
  const validatedFormConfig = generatedFormSchema.safeParse(
    loaderData.formConfig
  );

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <AppAppBar />
      <ChatBox />
      <Box
        pt={12}
        pb={14}
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        sx={(theme) => ({
          px: 3,
          [theme.breakpoints.down("sm")]: {
            px: 1,
          },
        })}
      >
        {validatedFormConfig.success ? (
          <FormAssistedPreview formConfig={validatedFormConfig.data} />
        ) : null}
      </Box>
    </Box>
  );
}
