import type { Json } from "~/supabase/database.types";
import type { MySupabaseClient } from "~/supabase/supabase.types";

export const upsertSurveySummary = async ({
  surveyId,
  surveySummaryId,
  dataResume,
  totalEntries,
  supabaseClient,
}: {
  surveyId: string;
  dataResume: Json;
  surveySummaryId?: number;
  totalEntries: number;
  supabaseClient: MySupabaseClient;
}) => {
  const response = await supabaseClient.from("Survey_Summaries").upsert({
    id: surveySummaryId,
    survey_id: surveyId,
    summary_data: dataResume,
    total_entries: totalEntries,
    updated_at: new Date().toUTCString(),
  });
  return response;
};

export const getSurveySummaryBySurveyId = async ({
  surveyId,
  supabaseClient,
}: {
  surveyId: string;
  supabaseClient: MySupabaseClient;
}) => {
  const response = await supabaseClient
    .from("Survey_Summaries")
    .select()
    .eq("survey_id", surveyId)
    .single();
  return response;
};
