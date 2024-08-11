import type { z } from "zod";
import type {
  fieldSchema,
  generatedFormSchema,
  sectionSchema,
} from "~/bot/schemas";

type AssistedSummary = {
  sumaryMessage: string | null;
};

export type SummaryTime = {
  hourFrequency?: { [k: string]: number };
} & AssistedSummary;
export type SummaryDate = {
  datesOfTheMonthFrequency?: { [k: string]: number };
  daysOfTheWeekFrequency?: { [k: string]: number };
  fullDateFrequency?: { [k: string]: number };
} & AssistedSummary;
export type SummarySingleValue = {
  valueFrequency?: { [k: string]: number };
} & AssistedSummary;
export type SummaryRange = {
  startFrequency?: { [k: string]: number };
  endFrequency?: { [k: string]: number };
} & AssistedSummary;

export type SummaryFieldObjectType =
  | SummaryTime
  | SummaryDate
  | SummarySingleValue
  | SummaryRange
  | null;

export type SummarySectionObjectType = {
  [k: string]: SummaryFieldObjectType;
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
                let value: SummaryFieldObjectType;
                switch (fieldConfigSchema.type) {
                  case "password":
                  case "textarea":
                  case "tel":
                  case "email":
                  case "file":
                  case "url":
                  case "text":
                    value = {};
                    break;
                  case "time":
                    value = {
                      hourFrequency: {},
                    } as SummaryTime;
                    break;
                  case "date":
                    value = {
                      datesOfTheMonthFrequency: {},
                      fullDateFrequency: {},
                      daysOfTheWeekFrequency: {},
                    } as SummaryDate;
                    break;
                  case "range":
                    value = {
                      startFrequency: {},
                      endFrequency: {},
                    } as SummaryRange;
                    break;
                  case "number":
                  case "rating":
                  case "radio":
                  case "checkbox":
                  case "slider":
                    value = {
                      valueFrequency: {},
                    } as SummarySingleValue;
                    break;
                }
                //
                value.sumaryMessage = null;
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
