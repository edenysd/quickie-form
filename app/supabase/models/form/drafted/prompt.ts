import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  getCachedChatSession,
  getLastMessageFromCachedChatSession,
  getUserCachedId,
  updateCachedChatSession,
} from "~/bot/chat";
import { createHistoryFetcher, saveHistory } from "./history";
import { generatedFormSchema } from "~/bot/schemas";

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
  let result = await chatSession.sendMessage(prompt);

  const formConfigTest = await getLastMessageFromCachedChatSession(
    getUserCachedId(user)
  );
  const formValidationTest = generatedFormSchema.safeParse(formConfigTest);

  //Ask for fixes if we get a bad JSON config
  if (formValidationTest.error) {
    result = await chatSession.sendMessage(
      `Please, fix the json format in your response, if there exits a case where you don't
       know how to fix a section remove it, this is the error message:\n ${formValidationTest.error}`
    );
    (await chatSession.getHistory()).splice(-3, 2);
  }

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
