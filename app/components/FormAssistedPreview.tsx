import type { z } from "zod";
import type {
  fieldSchema,
  generatedFormSchema,
  sectionSchema,
} from "~/bot/schemas";
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
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useMemo } from "react";

function FormField({
  fieldConfig,
}: {
  fieldConfig: z.infer<typeof fieldSchema>;
}) {
  switch (fieldConfig.type) {
    case "text":
      return (
        <Grid item xs={12} md={6}>
          <TextField
            required={fieldConfig.required}
            fullWidth
            label={fieldConfig.label}
            placeholder={fieldConfig.placeholder}
          />
        </Grid>
      );
    case "textarea":
      return (
        <Grid item xs={12} md={6}>
          <TextField
            multiline
            minRows={3}
            required={fieldConfig.required}
            fullWidth
            label={fieldConfig.label}
            placeholder={fieldConfig.placeholder}
          />
        </Grid>
      );
    case "radio":
      return (
        <Grid item xs={12} md={6}>
          <FormControl>
            <Tooltip describeChild title={fieldConfig.placeholder} followCursor>
              <FormLabel>{fieldConfig.label}</FormLabel>
            </Tooltip>
            <RadioGroup
              defaultValue={fieldConfig.options?.at(0)?.id}
              name={fieldConfig.name}
            >
              {fieldConfig.options?.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={fieldConfig.name + "." + option.id}
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
          <FormControl>
            <Tooltip describeChild title={fieldConfig.placeholder} followCursor>
              <FormLabel>{fieldConfig.label}</FormLabel>
            </Tooltip>
            <FormGroup>
              {fieldConfig.options?.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={fieldConfig.name + "." + option.id}
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
            type="number"
            inputMode="decimal"
            required={fieldConfig.required}
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
            type="tel"
            inputMode="tel"
            required={fieldConfig.required}
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
            type="email"
            inputMode="email"
            required={fieldConfig.required}
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
              sx={{ width: "100%" }}
              name={fieldConfig.name}
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
              sx={{ width: "100%" }}
              name={fieldConfig.name}
              label={fieldConfig.label}
            />
          </LocalizationProvider>
        </Grid>
      );
    case "file":
      return (
        <Grid item container xs={12} spacing={2} position={"relative"}>
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
              This field will be supported in upcomming releases
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              disabled
              fullWidth
              type="file"
              name={fieldConfig.name}
              helperText={fieldConfig.placeholder}
            />
          </Grid>
        </Grid>
      );
    case "url":
      return (
        <Grid item xs={12} md={6}>
          <TextField
            type="url"
            inputMode="url"
            required={fieldConfig.required}
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
          <Rating name={fieldConfig.name} max={fieldConfig.max || 5} />
        </Grid>
      );
    case "range":
      return (
        <Grid item xs={12} md={6}>
          <Typography component="legend">{fieldConfig.label}</Typography>
          <Box px={1}>
            <Slider
              name={fieldConfig.name}
              getAriaLabel={() => fieldConfig.label}
              valueLabelDisplay="auto"
              defaultValue={[fieldConfig.min || 0, fieldConfig.max || 0]}
              // marks
              // step={1}
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
              name={fieldConfig.name}
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
        <FormField key={fieldConfig.name} fieldConfig={fieldConfig} />
      )),
    [sectionConfig.fields]
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

function FormAssistedPreview({
  formConfig = [],
}: {
  formConfig: z.infer<typeof generatedFormSchema> | null;
}) {
  if (!formConfig) return;
  return (
    <Paper elevation={3} sx={{ width: "100%", maxWidth: "900px" }}>
      <Box
        display={"flex"}
        width={"100%"}
        p={3}
        flexDirection={"column"}
        gap={2}
        sx={(theme) => ({
          [theme.breakpoints.down("sm")]: {
            p: 0,
          },
        })}
      >
        {formConfig.map((sectionConfig) => (
          <FormSection key={sectionConfig.name} sectionConfig={sectionConfig} />
        ))}
      </Box>
    </Paper>
  );
}

export default FormAssistedPreview;
