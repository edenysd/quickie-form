import {
  getFormProps,
  getInputProps,
  getSelectProps,
  useForm,
} from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { LoadingButton } from "@mui/lab";
import type { DialogProps, GrowProps } from "@mui/material";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import { Form, useNavigation } from "@remix-run/react";
import { useSnackbar } from "notistack";
import { forwardRef, useEffect, useMemo } from "react";
import { z } from "zod";
import { TransitionGrowFromElementId } from "~/components/Animations";
import type { FormTemplateRow } from "~/supabase/supabase.types";

export const SURVEY_CONFIGS = {
  public_with_no_verification: "Public with no verification",
};

const DISABLED_SURVEY_CONFIGS = {
  public_with_single_use: "Public with a single use",
  public_with_email_verification: "Public with email verification",
  private_with_single_use: "Private with a single use and email verification",
  private_email_list: "Private for email list",
};

export const RUN_SURVEY_ACTION = "run_survey_with_form_template";

export const surveySchema = z.object({
  formTemplateId: z.number({ required_error: "formTemplateId is required" }),
  surveyType: z
    .enum(["public_with_no_verification"], {
      required_error: "surveyType is required",
    })
    .default("public_with_no_verification"),
  _action: z.literal(RUN_SURVEY_ACTION, {
    required_error: "Action is required",
  }),
  surveyLabel: z.string().min(4),
});

export default function RunSurveyWithFormTemplateDialog({
  row,
  originPercentage,
  ...params
}: DialogProps & {
  row: FormTemplateRow;
  originPercentage: { x: number; y: number };
}) {
  const navigation = useNavigation();
  const { enqueueSnackbar } = useSnackbar();
  const isLoadingRunSurveyAction =
    navigation.formData?.get("_action") === RUN_SURVEY_ACTION;

  const isRedirectionToNewSurvey =
    isLoadingRunSurveyAction &&
    navigation.location?.pathname.startsWith("/home/ongoing/survey/");

  useEffect(() => {
    if (isRedirectionToNewSurvey) {
      enqueueSnackbar({
        message: `New survey created`,
        variant: "success",
      });
    }
  }, [enqueueSnackbar, isRedirectionToNewSurvey]);

  const [form, fields] = useForm({
    onValidate({ formData }) {
      const result = parseWithZod(formData, { schema: surveySchema });
      return result;
    },
  });

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
      <Box
        {...getFormProps(form)}
        display={"flex"}
        flexDirection={"column"}
        method="POST"
        component={Form}
        gap={1}
        m={0}
      >
        <Alert severity="info">
          You can run multiple surveys with the same form template
        </Alert>
        <DialogTitle>
          <Box p={1} component={Paper} variant="outlined">
            <i>{row.name}</i>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box display={"flex"} flexDirection={"column"} gap={2} my={1}>
            <FormControl>
              <InputLabel id="label-survey-variant">Survey Variant</InputLabel>

              <Select
                {...getSelectProps(fields.surveyType)}
                labelId="label-survey-variant"
                defaultValue={Object.keys(SURVEY_CONFIGS)[0]}
                fullWidth
                label={"Survey Variant"}
              >
                {Object.entries(SURVEY_CONFIGS).map(([id, label]) => (
                  <MenuItem key={id} value={id}>
                    {label}
                  </MenuItem>
                ))}
                <ListSubheader>Comming Soon</ListSubheader>
                {Object.entries(DISABLED_SURVEY_CONFIGS).map(([id, label]) => (
                  <MenuItem key={id} value={id} disabled>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              {...getInputProps(fields.surveyLabel, { type: "text" })}
              label="Survey Label"
              required
              key={fields.surveyLabel.key}
              helperText={fields.surveyLabel.errors?.at(0)}
              error={!!fields.surveyLabel.errors?.length}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <input
            {...getInputProps(fields.formTemplateId, { type: "hidden" })}
            value={row.id}
          />
          <Button
            color="inherit"
            onClick={() => params.onClose!({}, "backdropClick")}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={isLoadingRunSurveyAction}
            variant="outlined"
            type="submit"
            name="_action"
            value={RUN_SURVEY_ACTION}
          >
            Run survey
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
