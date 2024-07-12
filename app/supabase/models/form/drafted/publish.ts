import type { SupabaseClient, User } from "@supabase/supabase-js";

export const publishDraftedForm = async ({
  supabaseClient,
  user,
}: {
  supabaseClient: SupabaseClient;
  user: User;
}) => {
  const response = await supabaseClient
    ?.from("Forms")
    .update([
      {
        status: "published",
      },
    ])
    .eq("owner", user?.id)
    .eq("status", "draft")
    .select();
  return response;
};
