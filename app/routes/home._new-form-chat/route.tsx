import { Box, Paper, Typography } from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import AppAppBar from "./components/NewFormAppBar";
import ChatBox, { promptSchema } from "./components/ChatBox";
import { parseWithZod } from "@conform-to/zod";
import {
  getCachedChatHistory,
  getLastMessageFromCachedChatSession,
  getUserCachedId,
  removeCachedChatSession,
  updateCachedChatHistory,
} from "../../bot/chat";
import { generatedFormSchema } from "../../bot/schemas";
import FormAssistedPreview from "./components/FormAssistedPreview";
import {
  createHistoryFetcher,
  processPrompt,
} from "~/supabase/models/form/drafted/prompt";
import { publishDraftedForm } from "~/supabase/models/form/drafted/publish";
import { publishDialogActionContent } from "./components/PublishDialog";

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
    const result = await processPrompt({ prompt, supabase, user });

    return json(result);
  } else if (_action === "publish") {
    const data = parseWithZod(formData, {
      schema: publishDialogActionContent,
    });
    if (data.status !== "success") {
      return data.reply();
    }
    const result = await publishDraftedForm({
      supabaseClient: supabase,
      templateName: data.value.templateName,
      user,
    });
    removeCachedChatSession({ id: getUserCachedId(user) });

    return json(result);
  } else if (_action === "logout") {
    const result = await supabase.auth.signOut();
    if (!result.error) {
      return redirect("/");
    }
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
  await updateCachedChatHistory({
    fetchHistory,
    id: getUserCachedId(user),
  });

  const formConfig = await getLastMessageFromCachedChatSession(
    getUserCachedId(user)
  );

  return json({
    user,
    formConfig,
    history: await getCachedChatHistory(getUserCachedId(user)),
  });
}

export default function Home() {
  const loaderData = useLoaderData<typeof loader>();
  const validatedFormConfig = generatedFormSchema.safeParse(
    loaderData.formConfig
  );
  const existsFormConfig =
    validatedFormConfig.success && validatedFormConfig.data.length > 0;

  return (
    <Box display={"flex"} flexDirection={"column"} alignItems={"center"}>
      <AppAppBar disablePublish={!existsFormConfig} />
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
        {existsFormConfig ? (
          <FormAssistedPreview formConfig={validatedFormConfig.data} />
        ) : (
          <Box
            component={Paper}
            variant="outlined"
            p={2}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            gap={1}
            color={"InfoText"}
          >
            <Typography variant="h5">Welcome to Quickie Form</Typography>
            <Typography variant="body1">
              Simply type what you want and we will make it happens.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
