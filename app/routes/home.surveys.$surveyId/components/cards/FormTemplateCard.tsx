import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import type { MouseEventHandler, ReactElement } from "react";
import { useState } from "react";
import { calculateOriginCoordsPercentageFromElement } from "~/components/Animations";
import PreviewFormTemplateDialog from "~/components/PreviewFormTemplateDialog";
import type { FormTemplateRow } from "~/supabase/supabase.types";
import dayjs from "dayjs";
import type { loader } from "../../route";

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
              {dayjs(loaderData.formTemplate.data!.updated_at!).format(
                "D/M/YYYY, h:mm:ss A"
              )}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={handlePreview} color="info">
              See preview
            </Button>
          </CardActions>
        </Card>
      </Grid>
    </>
  );
}
