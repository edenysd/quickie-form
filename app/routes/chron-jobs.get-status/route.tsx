import type {LoaderFunctionArgs} from '@vercel/remix';
import {json} from '@remix-run/react';
import {getTotalRunningSurveys} from '~/supabase/models/surveys/surveys';
import supabasePrivateServerClient from '~/supabase/supabasePrivateServerClient';

export async function loader({...args}: LoaderFunctionArgs) {
  const privateSupabase = supabasePrivateServerClient();

  let totalRunningSurveys = await getTotalRunningSurveys({
    supabaseClient: privateSupabase
  });

  totalRunningSurveys = await getTotalRunningSurveys({
    supabaseClient: privateSupabase
  });

  totalRunningSurveys = await getTotalRunningSurveys({
    supabaseClient: privateSupabase
  });

  return json({
    totalRunningSurveys: totalRunningSurveys.count
  });
}
