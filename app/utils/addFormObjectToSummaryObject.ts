import type { z } from "zod";
import type {
  fieldSchema,
  generatedFormSchema,
  sectionSchema,
} from "~/bot/schemas";
import type {
  SummaryDate,
  SummaryFieldObjectType,
  SummaryFormObjectType,
  SummaryRange,
  SummarySingleValue,
  SummaryTime,
} from "./createSummaryFormObject";
import type { StructuredFormDataEntry } from "./fromFormPlainNamesToObject";
import dayjs from "dayjs";

export const addFormObjectToSummaryObject = (
  formConfigSchema: z.infer<typeof generatedFormSchema>,
  summaryFormOject: SummaryFormObjectType,
  formDataEntry: StructuredFormDataEntry
): SummaryFormObjectType => {
  const summaryFormObject = Object.fromEntries(
    formConfigSchema.map(
      (sectionConfigSchema: z.infer<typeof sectionSchema>) => {
        const sectionName = sectionConfigSchema.name;
        return [
          sectionName,
          Object.fromEntries(
            sectionConfigSchema.fields.map(
              (fieldConfigSchema: z.infer<typeof fieldSchema>) => {
                const fieldDataEntryValue =
                  formDataEntry[sectionName][fieldConfigSchema.name];
                const summaryField =
                  summaryFormOject[sectionName][fieldConfigSchema.name];

                let returnedSummaryValue: SummaryFieldObjectType = null;
                switch (fieldConfigSchema.type) {
                  case "password":
                  case "textarea":
                  case "tel":
                  case "email":
                  case "file":
                  case "url":
                  case "text":
                    break;
                  case "time": {
                    const hour = (fieldDataEntryValue as string).split(":")[0];

                    returnedSummaryValue = summaryField as SummaryTime;
                    if (!returnedSummaryValue["hourFrequency"][hour]) {
                      returnedSummaryValue["hourFrequency"][hour] = 1;
                    } else {
                      returnedSummaryValue["hourFrequency"][hour]++;
                    }
                    break;
                  }
                  case "date": {
                    const dateTime = dayjs(fieldDataEntryValue as string);
                    const dayOfTheWeek = dateTime.get("day");
                    const dateOfTheMonth = dateTime.get("date");
                    const fullDate = dateTime.format("D/M/YYYY");

                    returnedSummaryValue = summaryField as SummaryDate;
                    if (
                      !returnedSummaryValue["datesOfTheMonthFrequency"][
                        dateOfTheMonth
                      ]
                    ) {
                      returnedSummaryValue["datesOfTheMonthFrequency"][
                        dateOfTheMonth
                      ] = 1;
                    } else {
                      returnedSummaryValue["datesOfTheMonthFrequency"][
                        dateOfTheMonth
                      ]++;
                    }

                    if (
                      !returnedSummaryValue["daysOfTheWeekFrequency"][
                        dayOfTheWeek
                      ]
                    ) {
                      returnedSummaryValue["daysOfTheWeekFrequency"][
                        dayOfTheWeek
                      ] = 1;
                    } else {
                      returnedSummaryValue["daysOfTheWeekFrequency"][
                        dayOfTheWeek
                      ]++;
                    }

                    if (!returnedSummaryValue["fullDateFrequency"][fullDate]) {
                      returnedSummaryValue["fullDateFrequency"][fullDate] = 1;
                    } else {
                      returnedSummaryValue["fullDateFrequency"][fullDate]++;
                    }
                    break;
                  }
                  case "range": {
                    const [minium, maxium] = fieldDataEntryValue as number[];

                    returnedSummaryValue = summaryField as SummaryRange;
                    if (!returnedSummaryValue["endFrequency"][maxium]) {
                      returnedSummaryValue["endFrequency"][maxium] = 1;
                    } else {
                      returnedSummaryValue["endFrequency"][maxium]++;
                    }

                    if (!returnedSummaryValue["startFrequency"][minium]) {
                      returnedSummaryValue["startFrequency"][minium] = 1;
                    } else {
                      returnedSummaryValue["startFrequency"][minium]++;
                    }
                    break;
                  }
                  case "checkbox": {
                    returnedSummaryValue = summaryField as SummarySingleValue;

                    (fieldDataEntryValue as string[]).forEach(
                      (optionId: string) => {
                        if (!returnedSummaryValue["valueFrequency"][optionId]) {
                          returnedSummaryValue["valueFrequency"][optionId] = 1;
                        } else {
                          returnedSummaryValue["valueFrequency"][optionId]++;
                        }
                      }
                    );
                    break;
                  }
                  case "number":
                  case "rating":
                  case "radio":
                  case "slider": {
                    const value = fieldDataEntryValue as number | string;

                    returnedSummaryValue = summaryField as SummarySingleValue;
                    if (!returnedSummaryValue["valueFrequency"][value]) {
                      returnedSummaryValue["valueFrequency"][value] = 1;
                    } else {
                      returnedSummaryValue["valueFrequency"][value]++;
                    }
                    break;
                  }
                }
                return [fieldConfigSchema.name, returnedSummaryValue];
              }
            )
          ),
        ];
      }
    )
  );

  return summaryFormObject;
};
