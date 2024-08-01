import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getUserCachedId, sendMessage } from "~/bot/chat";
import { createHistoryFetcher, saveHistory } from "./history";

export const processPrompt = async ({
  prompt,
  supabase,
  user,
}: {
  prompt: string;
  supabase: SupabaseClient;
  user: User;
}) => {
  const fetchHistory = createHistoryFetcher(supabase, user);
  const userCachedId = getUserCachedId(user);
  const { formConfig, history } = await sendMessage({
    fetchHistory,
    id: userCachedId,
    messageContent: prompt,
  });

  saveHistory({
    supabaseClient: supabase,
    user,
    history,
    formConfig,
  });

  return { formConfig, history };
};
