import dayjs from "dayjs";
import type { z } from "zod";
import type {
  fieldSchema,
  generatedFormSchema,
  sectionSchema,
} from "~/bot/schemas";
import { getFinalFieldName } from "./createFormSchema";

export const fromFormPlainNamesToObject = (
  formData: Record<string, string | string[] | undefined>,
  formConfigSchema: z.infer<typeof generatedFormSchema>
) => {
  const formStructuredData = Object.fromEntries(
    formConfigSchema.map(
      (sectionConfigSchema: z.infer<typeof sectionSchema>) => {
        const sectionName = sectionConfigSchema.name;
        return [
          sectionName,
          Object.fromEntries(
            sectionConfigSchema.fields.map(
              (fieldConfigSchema: z.infer<typeof fieldSchema>) => {
                const fieldName = getFinalFieldName(
                  fieldConfigSchema.name,
                  sectionName
                );
                const content = formData[fieldName];
                let value;
                switch (fieldConfigSchema.type) {
                  case "password":
                  case "textarea":
                  case "tel":
                  case "email":
                  case "file":
                  case "url":
                  case "radio":
                  case "time":
                  case "text":
                    value = content;
                    break;
                  case "date":
                    value = dayjs(content);
                    break;
                  case "number":
                    value = Number.parseFloat(content);
                    break;
                  case "range":
                    value = [
                      Number.parseInt(content[0]),
                      Number.parseInt(content[1]),
                    ];
                    break;
                  case "rating":
                  case "slider":
                    value = Number.parseInt(content);
                    break;
                  case "checkbox":
                    value = [content].flat();
                    break;
                }
                return [fieldConfigSchema.name, value];
              }
            )
          ),
        ];
      }
    )
  );
  return formStructuredData;
};
