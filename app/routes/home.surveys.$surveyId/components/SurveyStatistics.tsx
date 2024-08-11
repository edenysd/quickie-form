import { Alert, Box, Chip, Paper, Typography } from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import type { loader } from "../route";
import type {
  SummaryDate,
  SummaryFieldObjectType,
  SummaryFormObjectType,
  SummaryRange,
  SummarySectionObjectType,
  SummarySingleValue,
  SummaryTime,
} from "~/utils/createSummaryFormObject";
import type { z } from "zod";
import type { fieldSchema, sectionSchema } from "~/bot/schemas";
import { BarChart, PieChart } from "@mui/x-charts";

function FieldStatistics({
  fieldSummary,
  fieldConfig,
  isSurveyOpen,
}: {
  fieldSummary: SummaryFieldObjectType;
  fieldConfig: z.infer<typeof fieldSchema>;
  isSurveyOpen: boolean;
}) {
  const Charts = () => {
    switch (fieldConfig.type) {
      case "password":
      case "textarea":
      case "tel":
      case "email":
      case "file":
      case "url":
      case "text":
        return isSurveyOpen ? (
          <Alert severity="info">
            Fields of type{" "}
            <Chip
              sx={{ mx: 0.5 }}
              label={fieldConfig.type}
              variant="outlined"
              size="small"
            />{" "}
            show insights when the surveys are closed
          </Alert>
        ) : null;
      case "time": {
        const summaryTime = fieldSummary as SummaryTime;
        return (
          <Alert>Fields of type {fieldConfig.type} do not plot any data</Alert>
        );
      }
      case "date": {
        const summaryDate = fieldSummary as SummaryDate;
        return (
          <Alert>Fields of type {fieldConfig.type} do not plot any data</Alert>
        );
      }
      case "range": {
        const summaryRange = fieldSummary as SummaryRange;
        return (
          <Alert>Fields of type {fieldConfig.type} do not plot any data</Alert>
        );
      }
      case "number": {
        const summarySingleValue = fieldSummary as SummarySingleValue;
        return (
          <Alert>Fields of type {fieldConfig.type} do not plot any data</Alert>
        );
      }
      case "slider": {
        const summarySingleValue = fieldSummary as SummarySingleValue;

        for (let i = fieldConfig.min || 0; i <= (fieldConfig.max || 5); i++) {
          if (
            summarySingleValue.valueFrequency &&
            !summarySingleValue.valueFrequency[i]
          ) {
            summarySingleValue.valueFrequency[i] = 0;
          }
        }

        if (summarySingleValue.valueFrequency) {
          const xAxisData = Object.entries(
            summarySingleValue.valueFrequency
          ).map((entrie) => entrie[0]);

          const series = [
            {
              data: Object.entries(summarySingleValue.valueFrequency).map(
                (entrie) => entrie[1]
              ),
            },
          ];

          return (
            <BarChart
              height={300}
              margin={{
                right: 100,
              }}
              series={series}
              xAxis={[{ data: xAxisData, scaleType: "band" }]}
            />
          );
        }
        return null;
      }
      case "rating": {
        const summarySingleValue = fieldSummary as SummarySingleValue;

        for (let i = 1; i <= (fieldConfig.max || 5); i++) {
          if (
            summarySingleValue.valueFrequency &&
            !summarySingleValue.valueFrequency[i]
          ) {
            summarySingleValue.valueFrequency[i] = 0;
          }
        }

        const optionIndex = Object.fromEntries(
          fieldConfig.options?.map((option) => [option.id, option.label]) || []
        );
        if (summarySingleValue.valueFrequency) {
          const seriesData = Object.entries(
            summarySingleValue.valueFrequency
          ).map((entrie) => ({
            value: entrie[1],
            label: entrie[0] || entrie[0],
            id: entrie[0],
          }));

          return (
            <PieChart
              height={300}
              margin={{
                right: 100,
              }}
              series={[
                {
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  // arcLabel: (item) => `${item.label} (${item.value})`,
                  arcLabelMinAngle: 45,
                  data: seriesData,
                },
              ]}
              xAxis={[{ data: [fieldConfig.name], scaleType: "band" }]}
            />
          );
        }
        return null;
      }
      case "radio":
      case "checkbox": {
        const summarySingleValue = fieldSummary as SummarySingleValue;

        fieldConfig.options?.forEach((option) => {
          if (
            summarySingleValue.valueFrequency &&
            !summarySingleValue.valueFrequency[option.id]
          ) {
            summarySingleValue.valueFrequency[option.id] = 0;
          }
        });
        const optionIndex = Object.fromEntries(
          fieldConfig.options?.map((option) => [option.id, option.label]) || []
        );
        if (summarySingleValue.valueFrequency) {
          const seriesData = Object.entries(
            summarySingleValue.valueFrequency
          ).map((entrie) => ({
            value: entrie[1],
            label: optionIndex[entrie[0]] || entrie[0],
            id: entrie[0],
          }));

          return (
            <PieChart
              height={300}
              margin={{
                right: 100,
              }}
              series={[
                {
                  highlightScope: { faded: "global", highlighted: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "gray",
                  },
                  // arcLabel: (item) => `${item.label} (${item.value})`,
                  arcLabelMinAngle: 45,
                  data: seriesData,
                },
              ]}
              xAxis={[{ data: [fieldConfig.name], scaleType: "band" }]}
            />
          );
        }
      }
    }
  };

  return (
    <Box display={"flex"} flexDirection={"column"}>
      <Box mb={1}>
        <Typography variant="h6">{fieldConfig.label}</Typography>
        <Typography variant="caption">{fieldConfig.placeholder}</Typography>
      </Box>
      <Box>
        <Charts />
      </Box>
    </Box>
  );
}

function SectionStatistics({
  sectionSummary,
  sectionConfig,
  isSurveyOpen,
}: {
  sectionSummary: SummarySectionObjectType;
  sectionConfig: z.infer<typeof sectionSchema>;
  isSurveyOpen: boolean;
}) {
  return (
    <Box
      component={Paper}
      variant="outlined"
      p={{ xs: 1, md: 2 }}
      display={"flex"}
      flexDirection={"column"}
      gap={3}
    >
      <Box>
        <Typography variant="h5">{sectionConfig.label}</Typography>
        <Typography variant="caption">{sectionConfig.placeholder}</Typography>
      </Box>
      {sectionConfig.fields.map((fieldConfig) => {
        return (
          <Box key={fieldConfig.name} pl={{ xs: 0, md: 2 }}>
            <FieldStatistics
              fieldConfig={fieldConfig}
              fieldSummary={sectionSummary[fieldConfig.name]}
              isSurveyOpen={isSurveyOpen}
            />
          </Box>
        );
      })}
    </Box>
  );
}

export default function SurveyStatistics() {
  const loaderData = useLoaderData<typeof loader>();
  const isSurveyOpen = loaderData.surveyDetails.data!.survey_status === "open";
  const surveySummaryData = loaderData.surveySummary.data
    ?.summary_data as SummaryFormObjectType;
  const formTemplateConfig = loaderData.formTemplate.data?.config;
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      width={"100%"}
      gap={1}
    >
      <Box
        width={"100%"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
        gap={2}
      >
        <Typography
          variant="h4"
          fontFamily={"Virgil"}
          overflow={"hidden"}
          textOverflow={"ellipsis"}
        >
          Results
        </Typography>
        {formTemplateConfig?.map(
          (sectionConfig: z.infer<typeof sectionSchema>) => (
            <SectionStatistics
              key={sectionConfig.name}
              isSurveyOpen={isSurveyOpen}
              sectionConfig={sectionConfig}
              sectionSummary={surveySummaryData[sectionConfig.name]}
            />
          )
        )}
      </Box>
    </Box>
  );
}
