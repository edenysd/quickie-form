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
import type {
  fieldSchema,
  sectionSchema,
} from "~/generative-models/form-template/schemas";
import { BarChart, PieChart } from "@mui/x-charts";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { memo } from "react";
import { isDeepEqual } from "@mui/x-data-grid/internals";
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
        const summaryTime = structuredClone(fieldSummary) as SummaryTime;

        let TimeChart = null;
        if (summaryTime.timeFrequency) {
          dayjs.extend(customParseFormat);

          const HourMinutesObjectFrequencies: { [k: string]: number } = {};

          for (let hour = 0; hour < 24; hour++) {
            const hourString = hour < 10 ? `0${hour}` : hour.toString();
            for (let minutes = 0; minutes < 60; minutes += 10) {
              const minutesString =
                minutes < 10 ? `0${minutes}` : minutes.toString();
              HourMinutesObjectFrequencies[
                `${hourString}:${minutesString}`
              ] = 0;
            }
          }
          Object.entries(summaryTime.timeFrequency).forEach((entrie) => {
            HourMinutesObjectFrequencies[`${entrie[0].slice(0, 4)}0`] +=
              entrie[1];
          });

          const series = [
            {
              label: "Approximate time frequency",
              data: Object.entries(HourMinutesObjectFrequencies).map(
                (entrie) => entrie[1]
              ),
            },
          ];

          const xAxisData = Object.entries(HourMinutesObjectFrequencies).map(
            (entrie) => entrie[0]
          );

          TimeChart = (
            <BarChart
              height={300}
              series={series}
              xAxis={[
                {
                  data: xAxisData,
                  scaleType: "band",
                },
              ]}
            />
          );
        }

        return (
          <Box>
            <Box>{TimeChart}</Box>
          </Box>
        );
      }
      case "date": {
        const summaryDate = structuredClone(fieldSummary) as SummaryDate;

        let DaysOfTheWeekChart = null;
        if (summaryDate.daysOfTheWeekFrequency) {
          for (let i = 0; i < 7; i++) {
            if (
              summaryDate.daysOfTheWeekFrequency &&
              !summaryDate.daysOfTheWeekFrequency[i]
            ) {
              summaryDate.daysOfTheWeekFrequency[i] = 0;
            }
          }

          const xAxisData = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];

          const series = [
            {
              label: "Day of the week frequency",
              color: "blue",
              data: Object.entries(summaryDate.daysOfTheWeekFrequency).map(
                (entrie) => entrie[1]
              ),
            },
          ];

          DaysOfTheWeekChart = (
            <BarChart
              margin={{ left: 80, right: 80 }}
              layout="horizontal"
              height={300}
              series={series}
              yAxis={[
                {
                  data: xAxisData,
                  scaleType: "band",
                },
              ]}
            />
          );
        }

        let DaysOfTheMonthChart = null;
        if (summaryDate.datesOfTheMonthFrequency) {
          for (let i = 1; i <= 31; i++) {
            if (
              summaryDate.datesOfTheMonthFrequency &&
              !summaryDate.datesOfTheMonthFrequency[i]
            ) {
              summaryDate.datesOfTheMonthFrequency[i] = 0;
            }
          }

          const xAxisData = Object.entries(
            summaryDate.datesOfTheMonthFrequency
          ).map((entrie) => entrie[0]);

          const series = [
            {
              label: "Day of the month frequency",
              color: "red",
              data: Object.entries(summaryDate.datesOfTheMonthFrequency).map(
                (entrie) => entrie[1]
              ),
            },
          ];

          DaysOfTheMonthChart = (
            <BarChart
              height={300}
              series={series}
              xAxis={[
                {
                  data: xAxisData,
                  scaleType: "band",
                },
              ]}
            />
          );
        }

        let MonthsChart = null;
        if (summaryDate.fullDateFrequency) {
          const monthsSummary: { [k: string]: number } = {};
          for (let i = 1; i <= 12; i++) {
            monthsSummary[i] = 0;
          }

          const xAxisData: string[] = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ];

          Object.entries(summaryDate.fullDateFrequency).forEach((entrie) => {
            const month = entrie[0].split("/")[1];
            monthsSummary[month] += entrie[1];
          });

          const series = [
            {
              label: "Month frequency",
              color: "green",
              data: Object.entries(monthsSummary).map((entrie) => entrie[1]),
            },
          ];

          MonthsChart = (
            <BarChart
              margin={{ left: 80, right: 80 }}
              layout="horizontal"
              height={300}
              series={series}
              yAxis={[
                {
                  data: xAxisData,
                  scaleType: "band",
                },
              ]}
            />
          );
        }

        let FullDateChart = null;
        if (summaryDate.fullDateFrequency) {
          dayjs.extend(customParseFormat);

          const sortedFullDates: string[] = Object.entries(
            summaryDate.fullDateFrequency
          ).map((entrie) => {
            return entrie[0];
          });
          sortedFullDates.sort((a, b) => {
            const diff = dayjs(a, "D/M/YYYY").diff(dayjs(b, "D/M/YYYY"));
            return diff;
          });

          const xAxisData = sortedFullDates.map((strDate) =>
            dayjs(strDate, "D/M/YYYY").format("D MMM YYYY")
          );
          const series = [
            {
              label: "Date frequency",
              data: sortedFullDates.map(
                (fullDate) => summaryDate.fullDateFrequency![fullDate]
              ),
            },
          ];

          FullDateChart = (
            <BarChart
              height={300}
              series={series}
              xAxis={[
                {
                  data: xAxisData,
                  scaleType: "band",
                },
              ]}
            />
          );
        }

        return (
          <Box>
            <Box>{DaysOfTheWeekChart}</Box>
            <Box>{DaysOfTheMonthChart}</Box>
            <Box>{MonthsChart}</Box>
            <Box>{FullDateChart}</Box>
          </Box>
        );
      }
      case "range": {
        const summaryRangeValue = structuredClone(fieldSummary) as SummaryRange;
        let MinChart = null;

        if (summaryRangeValue.startFrequency) {
          for (let i = fieldConfig.min || 0; i <= (fieldConfig.max || 5); i++) {
            if (
              summaryRangeValue.startFrequency &&
              !summaryRangeValue.startFrequency[i]
            ) {
              summaryRangeValue.startFrequency[i] = 0;
            }
          }

          const xAxisData = Object.entries(
            summaryRangeValue.startFrequency
          ).map((entrie) => entrie[0]);

          const series = [
            {
              label: "Minimum frequencies",
              color: "blue",
              data: Object.entries(summaryRangeValue.startFrequency).map(
                (entrie) => entrie[1]
              ),
            },
          ];

          MinChart = (
            <BarChart
              height={300}
              series={series}
              xAxis={[
                {
                  data: xAxisData,
                  scaleType: "band",
                },
              ]}
            />
          );
        }
        let MaxChart = null;
        if (summaryRangeValue.endFrequency) {
          for (let i = fieldConfig.min || 0; i <= (fieldConfig.max || 5); i++) {
            if (
              summaryRangeValue.endFrequency &&
              !summaryRangeValue.endFrequency[i]
            ) {
              summaryRangeValue.endFrequency[i] = 0;
            }
          }

          const xAxisData = Object.entries(summaryRangeValue.endFrequency).map(
            (entrie) => entrie[0]
          );

          const series = [
            {
              label: "Maximum frequencies",
              color: "red",
              data: Object.entries(summaryRangeValue.endFrequency).map(
                (entrie) => entrie[1]
              ),
            },
          ];

          MaxChart = (
            <BarChart
              height={300}
              series={series}
              xAxis={[
                {
                  data: xAxisData,
                  scaleType: "band",
                },
              ]}
            />
          );
        }
        let CumulativeChart = null;
        if (
          summaryRangeValue.endFrequency &&
          summaryRangeValue.startFrequency
        ) {
          const cumulativeValue = structuredClone(
            summaryRangeValue.startFrequency
          );

          //start acum table
          for (let i = fieldConfig.min || 0; i <= (fieldConfig.max || 5); i++) {
            if (cumulativeValue && !cumulativeValue[i]) {
              cumulativeValue[i] = 0;
            }
            cumulativeValue[i] =
              (cumulativeValue[i - 1] || 0) +
              cumulativeValue[i] -
              (summaryRangeValue.endFrequency[i - 1] || 0);
          }

          const xAxisData = Object.entries(cumulativeValue).map(
            (entrie) => entrie[0]
          );

          const series = [
            {
              label: "Cumulative range frequencies",
              data: Object.entries(cumulativeValue).map((entrie) => entrie[1]),
            },
          ];

          CumulativeChart = (
            <BarChart
              height={300}
              series={series}
              xAxis={[
                {
                  data: xAxisData,
                  scaleType: "band",
                },
              ]}
            />
          );
        }
        return (
          <Box>
            <Box>{MinChart}</Box>
            <Box>{MaxChart}</Box>
            <Box>{CumulativeChart}</Box>
          </Box>
        );
      }
      case "number": {
        const summarySingleValue = fieldSummary as SummarySingleValue;

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
              series={series}
              xAxis={[{ data: xAxisData, scaleType: "band" }]}
            />
          );
        }
        return null;
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

const SectionStatistics = memo(function SectionStatistics({
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
},
isDeepEqual);

export const TOOGLE_SHARE_STATISTICS_ACTION = "toggle-share-statistics-action";

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
      {surveySummaryData ? (
        formTemplateConfig?.map(
          (sectionConfig: z.infer<typeof sectionSchema>) => (
            <SectionStatistics
              key={sectionConfig.name}
              isSurveyOpen={isSurveyOpen}
              sectionConfig={sectionConfig}
              sectionSummary={surveySummaryData[sectionConfig.name]}
            />
          )
        )
      ) : (
        <Alert severity="info">No data collected</Alert>
      )}
    </Box>
  );
}
