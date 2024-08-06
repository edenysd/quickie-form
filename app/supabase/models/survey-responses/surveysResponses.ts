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
  console.log(surveyId);
  const response = await supabaseClient.from("Survey_Responses").insert({
    survey_id: surveyId,
    data_entry: dataEntry,
  });
  console.log(response);
  return response;
};
