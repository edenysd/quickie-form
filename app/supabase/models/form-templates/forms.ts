import type { SupabaseClient, User } from "@supabase/supabase-js";

export const removeFormTemplateById = async ({
  supabaseClient,
  user,
  formTemplateId,
}: {
  supabaseClient: SupabaseClient;
  user: User;
  formTemplateId: string;
}) => {
  const response = await supabaseClient
    ?.from("Form_Templates")
    .delete()
    .eq("owner", user?.id)
    .eq("id", formTemplateId)
    .select();
  return response;
};
