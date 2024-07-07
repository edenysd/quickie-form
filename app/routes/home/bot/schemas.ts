import { z } from "zod";

const optionSchema = z.object({
  label: z.string(),
  id: z.string(),
});

export const fieldSchema = z.object({
  type: z.enum([
    "text",
    "password",
    "email",
    "number",
    "tel",
    "url",
    "date",
    "time",
    "checkbox",
    "radio",
    "range",
    "file",
  ]),
  name: z.string(),
  label: z.string(),
  placeholder: z.string(),
  required: z.boolean().optional(),
  options: z.array(optionSchema).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  defaultValue: z.string().optional(),
});

export const sectionSchema = z.object({
  type: z.literal("section"),
  name: z.string(),
  label: z.string(),
  placeholder: z.string(),
  fields: z.array(fieldSchema),
});

export const generatedFormSchema = z.array(sectionSchema);
