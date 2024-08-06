import type { ZodSchema } from "zod";
import { z } from "zod";
import type {
  fieldSchema,
  generatedFormSchema,
  sectionSchema,
} from "~/bot/schemas";

export const getFinalFieldName = (fieldName: string, sectionName: string) =>
  sectionName + "#" + fieldName;

export const createFormValidationSchema = (
  formConfigSchema: z.infer<typeof generatedFormSchema>
): ZodSchema => {
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
              case "password":
                validation = z.string();
                validation.max(fieldConfigSchema.max || 100);
                break;
              case "textarea":
                validation = z.string();
                validation.max(fieldConfigSchema.max || 300);
                break;
              case "radio":
                if (fieldConfigSchema.options!.length > 0)
                  validation = z.enum(
                    fieldConfigSchema.options!.map((option) => option.id)
                  );
                break;
              case "checkbox":
                validation = z
                  .array(z.string())
                  .or(z.string())
                  .or(z.undefined());
                break;
              case "number":
                validation = z.number();
                validation.max(
                  fieldConfigSchema.max || Number.MAX_SAFE_INTEGER
                );
                validation.min(
                  fieldConfigSchema.min || Number.MIN_SAFE_INTEGER
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
                validation = z.any();
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
                validation = z
                  .array(
                    z
                      .number()
                      .max(fieldConfigSchema.max || 100)
                      .min(fieldConfigSchema.min || 0)
                  )
                  .length(2);
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

  return z.object(formValidation);
};
