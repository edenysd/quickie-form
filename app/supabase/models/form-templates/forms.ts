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
    .eq("id", formTemplateId);

  return response;
};

export const getAllUserFormTemplates = async ({
  supabaseClient,
  user,
}: {
  supabaseClient: SupabaseClient;
  user: User;
}) => {
  const response = await supabaseClient
    ?.from("Form_Templates")
    .select()
    .neq("status", "draft")
    .order("updated_at", { ascending: false })
    .eq("owner", user?.id);
  return response;
};
