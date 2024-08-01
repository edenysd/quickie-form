import type { SupabaseClient, User } from "@supabase/supabase-js";

export const resetDraftedForm = async ({
  supabaseClient,
  user,
}: {
  supabaseClient: SupabaseClient;
  user: User;
}) => {
  const response = await supabaseClient
    ?.from("Form_Templates")
    .update([
      {
        history: null,
        config: null,
      },
    ])
    .eq("owner", user?.id)
    .eq("status", "draft")
    .select();
  return response;
};

export const publishDraftedForm = async ({
  supabaseClient,
  templateName,
  user,
}: {
  supabaseClient: SupabaseClient;
  templateName: string;
  user: User;
}) => {
  const response = await supabaseClient
    ?.from("Form_Templates")
    .update([
      {
        status: "published",
        name: templateName,
      },
    ])
    .eq("owner", user?.id)
    .eq("status", "draft")
    .select();
  return response;
};
