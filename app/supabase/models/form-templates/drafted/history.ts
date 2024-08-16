import type { User } from "@supabase/supabase-js";
import type { z } from "zod";
import type { ChatHistory } from "~/generative-models/form-template/chat";
import type { generatedFormSchema } from "~/generative-models/form-template/schemas";
import type { MySupabaseClient } from "~/supabase/supabase.types";

export const getHistoryFromDraftTemplate = async (
  supabase: MySupabaseClient,
  user: User
) => {
  const response = await supabase
    .from("Form_Templates")
    .select("history")
    .eq("owner", user.id)
    .eq("status", "draft")
    .limit(1)
    .maybeSingle();

  return response;
};

export const getConfigFromDraftTemplate = async (
  supabase: MySupabaseClient,
  user: User
) => {
  const response = await supabase
    .from("Form_Templates")
    .select("config")
    .eq("owner", user.id)
    .eq("status", "draft")
    .limit(1)
    .maybeSingle();

  return response;
};

export const saveHistory = async ({
  supabaseClient,
  history,
  formConfig,
  user,
}: {
  supabaseClient: MySupabaseClient;
  history: ChatHistory;
  formConfig: z.infer<typeof generatedFormSchema>;
  user: User;
}) => {
  const response = await supabaseClient
    .from("Form_Templates")
    .update({
      history,
      config: formConfig,
    })
    .eq("owner", user?.id)
    .eq("status", "draft")
    .select();

  if (!response?.data?.length) {
    return await supabaseClient?.from("Form_Templates").insert([
      {
        history: history,
        config: formConfig,
        owner: user?.id,
      },
    ]);
  }

  return response;
};
