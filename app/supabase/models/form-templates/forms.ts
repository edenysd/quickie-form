import type { User } from "@supabase/supabase-js";

import type {
  FormTemplateRow,
  MySupabaseClient,
} from "~/supabase/supabase.types";

export const removeFormTemplateById = async ({
  supabaseClient,
  user,
  formTemplateId,
}: {
  supabaseClient: MySupabaseClient;
  user: User;
  formTemplateId: string;
}) => {
  const response = await supabaseClient
    .from("Form_Templates")
    .delete()
    .eq("owner", user?.id)
    .eq("id", formTemplateId);

  return response;
};

export const getAllUserFormTemplates = async ({
  supabaseClient,
  user,
}: {
  supabaseClient: MySupabaseClient;
  user: User;
}) => {
  const response = await supabaseClient
    ?.from("Form_Templates")
    .select()
    .neq("status", "draft")
    .order("updated_at", { ascending: false })
    .eq("owner", user?.id)
    .returns<FormTemplateRow[]>();
  return response;
};
