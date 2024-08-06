import type { z } from "zod";
import type {
  fieldSchema,
  generatedFormSchema,
  sectionSchema,
} from "~/bot/schemas";

export type SummaryTime = {
  hourFrequency: { [k: string]: number };
};
export type SummaryDate = {
  datesOfTheMonthFrequency: { [k: string]: number };
  daysOfTheWeekFrequency: { [k: string]: number };
  fullDateFrequency: { [k: string]: number };
};
export type SummarySingleValue = {
  valueFrequency: { [k: string]: number };
};
export type SummaryRange = {
  startFrequency: { [k: string]: number };
  endFrequency: { [k: string]: number };
};

export type SummaryEntryObjectType =
  | SummaryTime
  | SummaryDate
  | SummarySingleValue
  | SummaryRange
  | null;

type SummarySectionObjectType = {
  [k: string]: SummaryEntryObjectType;
};

export type SummaryFormObjectType = {
  [k: string]: SummarySectionObjectType;
};

export const createSummaryFormObject = (
  formConfigSchema: z.infer<typeof generatedFormSchema>
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
                let value: SummaryEntryObjectType;
                switch (fieldConfigSchema.type) {
                  case "password":
                  case "textarea":
                  case "tel":
                  case "email":
                  case "file":
                  case "url":
                  case "text":
                    value = null;
                    break;
                  case "time":
                    value = {
                      hourFrequency: {},
                    };
                    break;
                  case "date":
                    value = {
                      datesOfTheMonthFrequency: {},
                      fullDateFrequency: {},
                      daysOfTheWeekFrequency: {},
                    };
                    break;
                  case "range":
                    value = {
                      startFrequency: {},
                      endFrequency: {},
                    };
                    break;
                  case "number":
                  case "rating":
                  case "radio":
                  case "checkbox":
                  case "slider":
                    value = {
                      valueFrequency: {},
                    };
                }
                return [fieldConfigSchema.name, value];
              }
            )
          ),
        ];
      }
    )
  );

  return summaryFormObject;
};
