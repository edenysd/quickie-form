import { z } from "zod";
import type {
  fieldSchema,
  generatedFormSchema,
  sectionSchema,
} from "~/bot/schemas";

export const getFinalFieldName = (fieldName: string, sectionName: string) =>
  sectionName + "." + fieldName;

export const createFormValidationSchema = (
  formConfigSchema: z.infer<typeof generatedFormSchema>
) => {
  const formValidation = Object.fromEntries(
    formConfigSchema.flatMap(
      (sectionConfigSchema: z.infer<typeof sectionSchema>) => {
        const sectionName = sectionConfigSchema.name;
        return sectionConfigSchema.fields.map(
          (fieldConfigSchema: z.infer<typeof fieldSchema>) => {
            const fieldName = getFinalFieldName(
              fieldConfigSchema.name,
              sectionName
            );
            let validation;
            switch (fieldConfigSchema.type) {
              case "text":
                validation = z.string();
                validation.max(fieldConfigSchema.max || 100);
                break;
              case "textarea":
                validation = z.string();
                validation.max(fieldConfigSchema.max || 300);
                break;
              case "radio":
                break;
              case "checkbox":
                break;
              case "number":
                validation = z.number();
                validation.max(
                  fieldConfigSchema.max || Number.MAX_SAFE_INTEGER
                );
                break;
              case "tel":
                validation = z.string();
                validation.max(fieldConfigSchema.max || 20);
                break;
              case "email":
                validation = z.string().email();
                validation.max(fieldConfigSchema.max || 50);
                break;
              case "date":
                validation = z.date();
                break;
              case "time":
                validation = z.string().time();
                break;
              case "file":
                break;
              case "url":
                validation = z.string().url();
                validation.max(fieldConfigSchema.max || 100);
                break;
              case "rating":
                validation = z.number();
                validation.max(fieldConfigSchema.max || 100);
                validation.min(fieldConfigSchema.min || 0);
                break;
              case "range":
                validation = z.number();
                validation.max(
                  fieldConfigSchema.max || Number.MAX_SAFE_INTEGER
                );
                validation.min(
                  fieldConfigSchema.min || Number.MIN_SAFE_INTEGER
                );
                break;
              case "slider":
                validation = z.number();
                validation.max(
                  fieldConfigSchema.max || Number.MAX_SAFE_INTEGER
                );
                validation.min(
                  fieldConfigSchema.min || Number.MIN_SAFE_INTEGER
                );
                break;
            }
            if (!fieldConfigSchema.required) {
              validation?.optional();
            }
            return [fieldName, validation];
          }
        );
      }
    )
  );
  console.log("NOO", formValidation);
};
