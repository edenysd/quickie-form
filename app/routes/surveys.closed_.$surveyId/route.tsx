import { Box, Button, Typography } from "@mui/material";
import type { LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData, useParams } from "@remix-run/react";
import { getSurveyById } from "~/supabase/models/surveys/surveys";
import supabasePrivateServerClient from "~/supabase/supabasePrivateServerClient";

export const meta: MetaFunction = () => {
  return [
    { title: "Survey Closed" },
    {
      name: "description",
      content: "The desired survey was already closed.",
    },
  ];
};

export async function loader({ params }: LoaderFunctionArgs) {
  const superSupabase = supabasePrivateServerClient();

  const surveyDetails = await getSurveyById({
    supabaseClient: superSupabase,
    surveyId: params.surveyId!,
  });

  return json({
    isStatisticsShared: surveyDetails.data?.is_statistics_shared,
  });
}

export default function ResetPassword() {
  const loaderData = useLoaderData<typeof loader>();
  const params = useParams();
  return (
    <Box
      width={"100%"}
      height={"100%"}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      gap={2}
    >
      <Typography variant="h2" textAlign={"center"} fontFamily={"Virgil"}>
        This survey is closed
      </Typography>
      {loaderData.isStatisticsShared ? (
        <Link to={`/surveys/statistics/${params.surveyId!}`}>
          <Button variant="outlined" size="large" color="success">
            See final results
          </Button>
        </Link>
      ) : null}

      <Link to="/">
        <Button size="large">Go back</Button>
      </Link>
    </Box>
  );
}
