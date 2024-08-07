import type { SupabaseClient, User } from "@supabase/supabase-js";
import { sendMessage } from "~/bot/chat";
import { getHistoryFromDraftTemplate, saveHistory } from "./history";

export const processPrompt = async ({
  prompt,
  supabase,
  user,
}: {
  prompt: string;
  supabase: SupabaseClient;
  user: User;
}) => {
  const draftHistory = await getHistoryFromDraftTemplate(supabase, user);

  const { formConfig, history } = await sendMessage({
    history: draftHistory.data?.history ?? [],
    messageContent: prompt,
  });

  await saveHistory({
    supabaseClient: supabase,
    user,
    history,
    formConfig,
  });

  return { formConfig, history };
};
