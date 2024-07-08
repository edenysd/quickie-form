import { Box } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import AppAppBar from "./components/AppAppBar";
import ChatBox, { promptSchema } from "./components/ChatBox";
import { parseWithZod } from "@conform-to/zod";
import type { ChatHistory } from "./bot/chat";
import {
  getCachedChatSession,
  updateCachedChatSession,
  getLastMessageFromCachedChatSession,
} from "./bot/chat";
import { generatedFormSchema } from "./bot/schemas";
import FormAssistedPreview from "./components/FormAssistedPreview";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { z } from "zod";

export const meta: MetaFunction = () => {
  return [
    { title: "Home" },
    {
      name: "description",
      content: "Home section for Quickie Form service.",
    },
  ];
};

const getUserCachedId = (user: User | null) => `local-saved-${user?.id}`;

const createHistoryFetcher = (supabase: SupabaseClient, user: User) => {
  return async () => {
    const response = await supabase
      .from("Forms")
      .select("history")
      .eq("owner", user.id)
      .eq("status", "draft")
      .limit(1)
      .maybeSingle();

    if (response.error) throw response.error;
    return (response.data?.history || []) as ChatHistory;
  };
};

const saveHistory = async ({
  supabaseClient,
  history,
  formConfig,
  user,
}: {
  supabaseClient: SupabaseClient;
  history: ChatHistory;
  formConfig: z.infer<typeof generatedFormSchema>;
  user: User;
}) => {
  const response = await supabaseClient
    ?.from("Forms")
    .update([
      {
        history,
        config: formConfig,
      },
    ])
    .eq("owner", user?.id)
    .eq("status", "draft")
    .select();

  if (!response?.data?.length) {
    await supabaseClient?.from("Forms").insert([
      {
        history: history,
        config: formConfig,
        owner: user?.id,
      },
    ]);
  }
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
  const fetchHistory = createHistoryFetcher(supabase, user);
  await updateCachedChatSession({
    fetchHistory,
    id: getUserCachedId(user),
  });
  const chatSession = getCachedChatSession(getUserCachedId(user))!;
  const result = await chatSession.sendMessage(prompt);
  saveHistory({
    supabaseClient: supabase,
    user,
    history: await chatSession.getHistory(),
    formConfig: await getLastMessageFromCachedChatSession(
      getUserCachedId(user)
    ),
  });

  return json(result);
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

  const fetchHistory = createHistoryFetcher(supabase, user);
  await updateCachedChatSession({
    fetchHistory,
    id: getUserCachedId(user),
  });

  return json({
    user,
    formConfig: await getLastMessageFromCachedChatSession(
      getUserCachedId(user)
    ),
    history: await getCachedChatSession(getUserCachedId(user))?.getHistory(),
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
