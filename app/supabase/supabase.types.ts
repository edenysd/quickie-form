import type { SupabaseClient } from "@supabase/supabase-js";
import type { MergeDeep } from "type-fest";
import type { Database as DatabaseGenerated } from "./database.types";
import type { ChatHistory } from "~/generative-models/form-template/chat";
import type { z } from "zod";
import type { generatedFormSchema } from "~/generative-models/form-template/schemas";

type InjectionTypesToFormTemplates = {
  config: z.infer<typeof generatedFormSchema>;
  history: ChatHistory;
};

// Override the type for a specific column in a view:
export type Database = MergeDeep<
  DatabaseGenerated,
  {
    public: {
      Tables: {
        Form_Templates: {
          Row: InjectionTypesToFormTemplates;
          Insert: Partial<InjectionTypesToFormTemplates>;
          Update: Partial<InjectionTypesToFormTemplates>;
        };
      };
    };
  }
>;

export type FormTemplateRow =
  Database["public"]["Tables"]["Form_Templates"]["Row"];

export type SurveyRow = Database["public"]["Tables"]["Surveys"]["Row"];

export type SurveyVariant = Database["public"]["Enums"]["Survey Variants"];

export type SurveyStatus = Database["public"]["Enums"]["Survey Status"];

export type SurveyResponseRow =
  Database["public"]["Tables"]["Survey_Responses"]["Row"];

export type MySupabaseClient = SupabaseClient<Database>;
