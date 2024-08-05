import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { parse } from "@supabase/ssr";
import supabaseServerClient from "~/supabase/supabaseServerClient";
import { getSurveyById } from "~/supabase/models/surveys/surveys";
import { getFormTemplateById } from "~/supabase/models/form-templates/forms";
import type { MouseEventHandler, ReactElement } from "react";
import { useState } from "react";
import { calculateOriginCoordsPercentageFromElement } from "~/components/Animations";
import PreviewFormTemplateDialog from "~/components/PreviewFormTemplateDialog";
import type { FormTemplateRow } from "~/supabase/supabase.types";

export const meta: MetaFunction = () => {
  return [
    { title: "Survey Detail" },
    {
      name: "description",
      content: "Details about a specific running survey",
    },
  ];
};

export async function action({ request }: LoaderFunctionArgs) {
  const headers = new Headers();
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const supabase = supabaseServerClient(cookies, headers);

  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || user === null) {
    return redirect("/sign-in");
  }

  const formData = await request.formData();
  const _action = formData.get("_action") as string;

  if (_action === null) {
    return null;
  }
  return null;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const headers = new Headers();
  const cookies = parse(request.headers.get("Cookie") ?? "");

  const supabase = supabaseServerClient(cookies, headers);

  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !user) {
    return redirect("/sign-in");
  }

  const surveyDetails = await getSurveyById({
    supabaseClient: supabase,
    user,
    surveyId: params.surveyId!,
  });

  const formTemplate = await getFormTemplateById({
    supabaseClient: supabase,
    user,
    templateId: surveyDetails.data!.template_id!.toString(),
  });

  return json({ surveyDetails, formTemplate, user });
}

export default function FormTemplateCard() {
  const loaderData = useLoaderData<typeof loader>();
  const [currentOverlayAction, setCurrentOverlayAction] =
    useState<ReactElement | null>(null);

  const handlePreview: MouseEventHandler<HTMLButtonElement> = (e) => {
    const originElement = e.currentTarget;
    const originCoordsPercentage = calculateOriginCoordsPercentageFromElement({
      originElement,
    });
    setCurrentOverlayAction(
      <PreviewFormTemplateDialog
        open={true}
        formTemplateRow={
          loaderData.formTemplate!.data! as unknown as FormTemplateRow
        }
        originPercentage={originCoordsPercentage}
        onClose={() =>
          setCurrentOverlayAction(
            <PreviewFormTemplateDialog
              open={false}
              formTemplateRow={
                loaderData.formTemplate!.data! as unknown as FormTemplateRow
              }
              originPercentage={originCoordsPercentage}
            />
          )
        }
      />
    );
  };
  return (
    <>
      {currentOverlayAction}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              sx={{ overflow: "hidden" }}
              title={loaderData.formTemplate.data?.name}
              subheader="Template"
            />
            <CardContent sx={{ py: 0 }}>
              <Typography variant="caption">
                Last Update{" "}
                {new Date(
                  loaderData.formTemplate.data!.updated_at!
                ).toLocaleString()}
              </Typography>
            </CardContent>
            <CardActions>
              <Button onClick={handlePreview} color="info">
                See preview
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
