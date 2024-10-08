import type { DialogProps, GrowProps } from "@mui/material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Form, useActionData } from "@remix-run/react";
import { forwardRef, useEffect, useMemo } from "react";
import { TransitionGrowFromElementId } from "~/components/Animations";
import type { SurveyRow } from "~/supabase/supabase.types";
import type { action } from "../routes/home.ongoing/route";
import { useSnackbar } from "notistack";

export const CLOSE_SURVEY_BY_ID_ACTION = "close_survey_by_id";

export default function CloseSurveyDialog({
  row,
  originPercentage,
  ...params
}: DialogProps & {
  row: SurveyRow;
  originPercentage: { x: number; y: number };
}) {
  const actionData = useActionData<typeof action>();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    if (
      actionData?._action === CLOSE_SURVEY_BY_ID_ACTION &&
      actionData?.surveyId === row.id
    ) {
      if (actionData?.sucess)
        enqueueSnackbar({ message: "Survey closed", variant: "success" });
      else
        enqueueSnackbar({ message: "Error closing survey", variant: "error" });
    }
  }, [actionData, enqueueSnackbar, row.id]);

  const CurrentTransition = useMemo(
    () =>
      forwardRef(function CurrentTransition(props: GrowProps, ref) {
        return (
          <TransitionGrowFromElementId
            {...props}
            ref={ref}
            originPercentage={originPercentage}
          />
        );
      }),
    [originPercentage]
  );

  return (
    <Dialog {...params} TransitionComponent={CurrentTransition}>
      <Alert variant="filled" severity="warning">
        {"Closed surveys can't be reopen"}
      </Alert>
      <DialogTitle>Close Survey</DialogTitle>
      <DialogContent>
        Are you sure that you want to close the <b>{row.survey_label}</b> survey
        and start to process all the collected data?
      </DialogContent>
      <DialogActions>
        <Box method="POST" component={Form} display={"flex"} gap={1} m={0}>
          <input type="hidden" name="surveyId" value={row.id} />
          <Button
            color="inherit"
            onClick={() => params.onClose!({}, "backdropClick")}
          >
            Cancel
          </Button>
          <Button
            onClick={() => params.onClose!({}, "backdropClick")}
            color="secondary"
            variant="outlined"
            type="submit"
            name="_action"
            value={CLOSE_SURVEY_BY_ID_ACTION}
          >
            CLOSE SURVEY
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
