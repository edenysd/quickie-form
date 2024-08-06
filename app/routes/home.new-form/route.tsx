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
import { processPrompt } from "~/supabase/models/form-templates/drafted/prompt";
import { publishDialogActionContent } from "./components/PublishDialog";
import {
  publishDraftedForm,
  resetDraftedForm,
} from "~/supabase/models/form-templates/drafted/status";
import { createHistoryFetcher } from "~/supabase/models/form-templates/drafted/history";
import FullFormComponent from "~/components/FullFormComponent";

export const meta: MetaFunction = () => {
  return [
    { title: "Form Template Creation" },
    {
      name: "description",
      content:
        "Form Template creation tool for an eazy configuration and deployment.",
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
    await publishDraftedForm({
      supabaseClient: supabase,
      templateName: data.value.templateName,
      user,
    });
    removeCachedChatSession({ id: getUserCachedId(user) });

    return redirect("/home/templates");
  } else if (_action === "reset") {
    await resetDraftedForm({ supabaseClient: supabase, user });
    removeCachedChatSession({ id: getUserCachedId(user) });
    return json({});
  }
  await new Promise((resolve) => setTimeout(resolve, 4000));
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

export default function NewForm() {
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
        maxWidth={"md"}
        display={"flex"}
        justifyContent={"center"}
        sx={(theme) => ({
          [theme.breakpoints.down("md")]: {
            px: 1,
          },
        })}
      >
        {existsFormConfig ? (
          <FullFormComponent
            formConfig={validatedFormConfig.data}
            hideSubmitButton={true}
          />
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
            <Typography variant="h5" fontFamily={"Virgil"}>
              Form Template creation tool
            </Typography>
            <Typography variant="body1">
              Simply type what you want and then publish your form template.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
