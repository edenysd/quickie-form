import { Box } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import AppAppBar from "./components/AppAppBar";
import ChatBox, { promptSchema } from "./components/ChatBox";
import { parseWithZod } from "@conform-to/zod";
import {
  getCachedChatSession,
  updateCachedChatSession,
  getLastMessageFromCachedChatSession,
  getUserCachedId,
} from "../../bot/chat";
import { generatedFormSchema } from "../../bot/schemas";
import FormAssistedPreview from "./components/FormAssistedPreview";
import {
  createHistoryFetcher,
  processPrompt,
} from "~/supabase/models/form/drafted/prompt";

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

  if (_action === "add-prompt") {
    const data = parseWithZod(formData, { schema: promptSchema });
    if (data.status !== "success") {
      return data.reply();
    }
    const prompt = data.value.prompt;
    const result = processPrompt({ prompt, supabase, user });

    return json(result);
  } else if (_action === "publish") {
    const data = parseWithZod(formData, { schema: promptSchema });
    if (data.status !== "success") {
      return data.reply();
    }
    return null;
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
