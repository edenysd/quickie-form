import type { SupabaseClient, User } from "@supabase/supabase-js";

export const publishDraftedForm = async ({
  supabaseClient,
  templateName,
  user,
}: {
  supabaseClient: SupabaseClient;
  templateName: string,
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
