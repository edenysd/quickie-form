import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { z } from "zod";
import type { ChatHistory } from "~/bot/chat";
import type { generatedFormSchema } from "~/bot/schemas";

export const createHistoryFetcher = (supabase: SupabaseClient, user: User) => {
  return async () => {
    const response = await supabase
      .from("Form_Templates")
      .select("history")
      .eq("owner", user.id)
      .eq("status", "draft")
      .limit(1)
      .maybeSingle();

    if (response.error) throw response.error;
    return (response.data?.history || []) as ChatHistory;
  };
};

export const saveHistory = async ({
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
    ?.from("Form_Templates")
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
    await supabaseClient?.from("Form_Templates").insert([
      {
        history: history,
        config: formConfig,
        owner: user?.id,
      },
    ]);
  }
};
