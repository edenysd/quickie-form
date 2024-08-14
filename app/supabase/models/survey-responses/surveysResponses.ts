import type { Json } from "~/supabase/database.types";
import type { MySupabaseClient } from "~/supabase/supabase.types";

export const insertSurveyResponse = async ({
  surveyId,
  dataEntry,
  supabaseClient,
}: {
  surveyId: string;
  dataEntry: Json;
  supabaseClient: MySupabaseClient;
}) => {
  const response = await supabaseClient.from("Survey_Responses").insert({
    survey_id: surveyId,
    data_entry: dataEntry,
  });
  return response;
};

export const getAllSurveyResponseForSurveyId = async ({
  surveyId,
  supabaseClient,
}: {
  surveyId: string;
  supabaseClient: MySupabaseClient;
}) => {
  const response = await supabaseClient
    .from("Survey_Responses")
    .select()
    .eq("survey_id", surveyId);
  return response;
};
