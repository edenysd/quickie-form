import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  getCachedChatSession,
  getLastMessageFromCachedChatSession,
  getUserCachedId,
  updateCachedChatSession,
} from "~/bot/chat";
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
  return result;
};
export { createHistoryFetcher };
