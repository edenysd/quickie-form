import type { User } from "@supabase/supabase-js";
import type {
  MySupabaseClient,
  SurveyVariant,
} from "~/supabase/supabase.types";

export const getAllUserRunningSurveys = async ({
  supabaseClient,
  user,
}: {
  supabaseClient: MySupabaseClient;
  user: User;
}) => {
  const response = await supabaseClient
    ?.from("Surveys")
    .select()
    .eq("survey_status", "open")
    .order("created_at", { ascending: false })
    .eq("owner", user?.id);
  return response;
};
export const getAllUserClosedSurveys = async ({
  supabaseClient,
  user,
}: {
  supabaseClient: MySupabaseClient;
  user: User;
}) => {
  const response = await supabaseClient
    ?.from("Surveys")
    .select()
    .eq("survey_status", "closed")
    .order("closed_at", { ascending: false })
    .eq("owner", user?.id);
  return response;
};

export const insertSurvey = async ({
  surveyLabel,
  templateId,
  surveyVariant,
  user,
  supabaseClient,
}: {
  surveyLabel: string;
  templateId: number;
  surveyVariant: SurveyVariant;
  user: User;
  supabaseClient: MySupabaseClient;
}) => {
  const response = await supabaseClient
    .from("Surveys")
    .insert({
      survey_label: surveyLabel,
      template_id: templateId,
      survey_variant: surveyVariant,
      survey_status: "open",
      owner: user.id,
    })
    .select();

  return response;
};

export const getSurveyById = async ({
  surveyId,
  supabaseClient,
}: {
  surveyId: string;
  supabaseClient: MySupabaseClient;
}) => {
  const response = await supabaseClient
    ?.from("Surveys")
    .select()
    .eq("id", surveyId)
    .single();
  return response;
};

export const closeSurveyById = async ({
  surveyId,
  supabaseClient,
  user,
}: {
  surveyId: string;
  supabaseClient: MySupabaseClient;
  user: User;
}) => {
  const response = await supabaseClient
    ?.from("Surveys")
    .update({
      survey_status: "closed",
      closed_at: new Date().toUTCString(),
    })
    .eq("id", surveyId)
    .eq("owner", user?.id);

  return response;
};

export const setSurveyShareStatisticsById = async ({
  surveyId,
  supabaseClient,
  user,
  newShareStatisticsValue,
}: {
  surveyId: string;
  supabaseClient: MySupabaseClient;
  user: User;
  newShareStatisticsValue: boolean;
}) => {
  const response = await supabaseClient
    ?.from("Surveys")
    .update({
      is_statistics_shared: newShareStatisticsValue,
    })
    .eq("id", surveyId)
    .eq("owner", user?.id);

  return response;
};

export const getTotalRunningSurveys = async ({
  supabaseClient,
}: {
  supabaseClient: MySupabaseClient;
}) => {
  const response = await supabaseClient
    ?.from("Surveys")
    .select("*", { count: "exact", head: true })
    .eq("survey_status", "open");
  return response;
};
