import type { z } from "zod";
import type {
  fieldSchema,
  generatedFormSchema,
  sectionSchema,
} from "~/generative-models/form-template/schemas";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
  Grid,
  Rating,
  Slider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo, useReducer } from "react";
import {
  createFormValidationSchema,
  getFinalFieldName,
} from "../utils/createFormSchema";
import { parseWithZod } from "@conform-to/zod";
import { FormProvider, useField, useForm } from "@conform-to/react";
import { Form, useNavigation } from "@remix-run/react";
import {
  getFormProps,
  getInputProps,
} from "node_modules/@conform-to/react/helpers";
import dayjs from "dayjs";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

function FormField({
  fieldConfig,
  sectionConfig,
}: {
  fieldConfig: z.infer<typeof fieldSchema>;
  sectionConfig: z.infer<typeof sectionSchema>;
}) {
  const finalFieldName = getFinalFieldName(
    fieldConfig.name,
    sectionConfig.name
  );
  const [meta, form] = useField(finalFieldName);

  const [showPassword, toggleShowPassword] = useReducer((b) => !b, false);

  switch (fieldConfig.type) {
    case "text":
      return (
        <Grid item xs={12} md={6}>
          <TextField
            {...getInputProps(meta, { type: "text" })}
            key={meta.key}
            helperText={meta.errors?.at(0)}
            error={!!meta.errors?.length}
            required={fieldConfig.required}
            fullWidth
            label={fieldConfig.label}
            placeholder={fieldConfig.placeholder}
          />
        </Grid>
      );
    case "password":
      return (
        <Grid item xs={12} md={6}>
          <TextField
            {...getInputProps(meta, {
              type: showPassword ? "text" : "password",
            })}
            key={meta.key}
            helperText={meta.errors?.at(0)}
            error={!!meta.errors?.length}
            required={fieldConfig.required}
            fullWidth
            label={fieldConfig.label}
            placeholder={fieldConfig.placeholder}
            autoComplete={finalFieldName}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      );
    case "textarea":
      return (
        <Grid item xs={12} md={6}>
          <TextField
            {...getInputProps(meta, { type: "text" })}
            key={meta.key}
            helperText={meta.errors?.at(0)}
            error={!!meta.errors?.length}
            required={fieldConfig.required}
            multiline
            minRows={3}
            fullWidth
            label={fieldConfig.label}
            placeholder={fieldConfig.placeholder}
          />
        </Grid>
      );
    case "radio":
      return (
        <Grid item xs={12} md={6}>
          <FormControl required={fieldConfig.required}>
            <Tooltip describeChild title={fieldConfig.placeholder} followCursor>
              <FormLabel>{fieldConfig.label}</FormLabel>
            </Tooltip>
            <RadioGroup
              defaultValue={fieldConfig.options?.at(0)?.id}
              name={finalFieldName}
            >
              {fieldConfig.options?.map((option) => (
                <FormControlLabel
                  key={option.id}
                  name={finalFieldName}
                  value={option.id}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
      );
    case "checkbox":
      return (
        <Grid item xs={12} md={6}>
          <FormControl required={fieldConfig.required}>
            <Tooltip describeChild title={fieldConfig.placeholder} followCursor>
              <FormLabel>{fieldConfig.label}</FormLabel>
            </Tooltip>
            <FormGroup>
              {fieldConfig.options?.map((option) => (
                <FormControlLabel
                  key={option.id}
                  name={finalFieldName}
                  value={option.id}
                  control={<Checkbox />}
                  label={option.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
      );
    case "number":
      return (
        <Grid item xs={12} md={6}>
          <TextField
            {...getInputProps(meta, { type: "number" })}
            key={meta.key}
            helperText={meta.errors?.at(0)}
            error={!!meta.errors?.length}
            required={fieldConfig.required}
            type="number"
            inputMode="decimal"
            fullWidth
            label={fieldConfig.label}
            placeholder={fieldConfig.placeholder}
            inputProps={{
              min: fieldConfig.min,
              max: fieldConfig.max,
            }}
          />
        </Grid>
      );
    case "tel":
      return (
        <Grid item xs={12} md={6}>
          <TextField
            {...getInputProps(meta, { type: "tel" })}
            key={meta.key}
            helperText={meta.errors?.at(0)}
            error={!!meta.errors?.length}
            required={fieldConfig.required}
            inputMode="tel"
            fullWidth
            label={fieldConfig.label}
            placeholder={fieldConfig.placeholder}
          />
        </Grid>
      );
    case "email":
      return (
        <Grid item xs={12} md={6}>
          <TextField
            {...getInputProps(meta, { type: "email" })}
            key={meta.key}
            helperText={meta.errors?.at(0)}
            error={!!meta.errors?.length}
            required={fieldConfig.required}
            inputMode="email"
            fullWidth
            label={fieldConfig.label}
            placeholder={fieldConfig.placeholder}
          />
        </Grid>
      );
    case "date":
      return (
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              defaultValue={dayjs()}
              sx={{ width: "100%" }}
              name={finalFieldName}
              label={fieldConfig.label}
            />
          </LocalizationProvider>
        </Grid>
      );
    case "time":
      return (
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              defaultValue={dayjs()}
              format="HH:mm:ss"
              sx={{ width: "100%" }}
              name={finalFieldName}
              label={fieldConfig.label}
            />
          </LocalizationProvider>
        </Grid>
      );
    case "file":
      return (
        <Grid item container xs={12} spacing={2} position={"relative"} my={2}>
          {/* @TODO remove this overlay when file fields is enabled and remove disabled state*/}
          <Grid
            item
            sx={{
              backdropFilter: "blur(4px)",
            }}
            display={"flex"}
            alignItems={"center"}
            position={"absolute"}
            width={"100%"}
            height={"100%"}
            zIndex={10}
          >
            <Typography variant="body1" color={"orange"}>
              This field will be supported in upcoming releases
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled
              fullWidth
              type="file"
              name={finalFieldName}
              helperText={fieldConfig.placeholder}
            />
          </Grid>
        </Grid>
      );
    case "url":
      return (
        <Grid item xs={12} md={6}>
          <TextField
            {...getInputProps(meta, { type: "url" })}
            key={meta.key}
            helperText={meta.errors?.at(0)}
            error={!!meta.errors?.length}
            required={fieldConfig.required}
            inputMode="url"
            fullWidth
            label={fieldConfig.label}
            placeholder={fieldConfig.placeholder}
          />
        </Grid>
      );
    case "rating":
      return (
        <Grid item xs={12} md={6}>
          <Typography component="legend">{fieldConfig.label}</Typography>
          <Rating
            {...getInputProps(meta, { type: "number", value: false })}
            key={meta.key}
            defaultValue={Math.round((fieldConfig.max || 5) / 2)}
            value={undefined}
            name={finalFieldName}
            max={fieldConfig.max || 5}
          />
        </Grid>
      );
    case "range":
      return (
        <Grid item xs={12} md={6}>
          <Typography component="legend">{fieldConfig.label}</Typography>
          <Box px={1}>
            <Slider
              name={finalFieldName}
              getAriaLabel={() => fieldConfig.label}
              valueLabelDisplay="auto"
              defaultValue={[fieldConfig.min || 0, fieldConfig.max || 0]}
              min={fieldConfig.min || 0}
              max={fieldConfig.max || 0}
            />
          </Box>
        </Grid>
      );
    case "slider":
      return (
        <Grid item xs={12} md={6}>
          <Typography component="legend">{fieldConfig.label}</Typography>
          <Box px={1}>
            <Slider
              name={finalFieldName}
              aria-label={fieldConfig.label}
              valueLabelDisplay="auto"
              // marks
              // step={1}
              min={fieldConfig.min || 0}
              max={fieldConfig.max || 0}
            />
          </Box>
        </Grid>
      );
  }
  return null;
}

function FormSection({
  sectionConfig,
}: {
  sectionConfig: z.infer<typeof sectionSchema>;
}) {
  const sectionList = useMemo(
    () =>
      sectionConfig.fields.map((fieldConfig) => (
        <FormField
          key={fieldConfig.name}
          fieldConfig={fieldConfig}
          sectionConfig={sectionConfig}
        />
      )),
    [sectionConfig]
  );
  return (
    <Box display={"flex"} flexDirection={"column"} p={2} gap={1}>
      <Typography variant="h5">
        {sectionConfig.label}{" "}
        <FormHelperText>{sectionConfig.placeholder}</FormHelperText>
      </Typography>
      <Grid container spacing={2}>
        {sectionList}
      </Grid>
    </Box>
  );
}

function FullFormComponent({
  formConfig = [],
  action,
  onlyValidationNoSubmitAction = false,
  hideSubmitButton = false,
}: {
  formConfig: z.infer<typeof generatedFormSchema> | null;
  onlyValidationNoSubmitAction?: boolean;
  hideSubmitButton?: boolean;
  action?: string;
}) {
  const formValidationSchema = createFormValidationSchema(formConfig!);
  const navigation = useNavigation();
  const [form, fields] = useForm({
    onValidate({ formData }) {
      const parse = parseWithZod(formData, { schema: formValidationSchema });

      return parse;
    },
    onSubmit(e) {
      if (onlyValidationNoSubmitAction) e.preventDefault();
    },
  });

  if (!formConfig) return;

  return (
    <Paper elevation={3} sx={{ width: "100%" }}>
      <Box
        {...getFormProps(form)}
        component={Form}
        method="POST"
        display={"flex"}
        width={"100%"}
        action={action}
        p={3}
        flexDirection={"column"}
        gap={2}
        m={0}
        sx={(theme) => ({
          [theme.breakpoints.down("sm")]: {
            p: 0,
          },
        })}
      >
        <FormProvider context={form.context}>
          {formConfig.map((sectionConfig) => (
            <FormSection
              key={sectionConfig.name}
              sectionConfig={sectionConfig}
            />
          ))}
        </FormProvider>
        {!hideSubmitButton ? (
          <LoadingButton
            loading={navigation.state !== "idle"}
            variant="outlined"
            name="_action"
            value="finish-survey"
            type="submit"
            form={form.id}
            sx={{ m: 2 }}
          >
            Finish Form
          </LoadingButton>
        ) : null}
      </Box>
    </Paper>
  );
}

export default FullFormComponent;
