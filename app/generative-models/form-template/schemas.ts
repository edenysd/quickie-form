import { z } from "zod";

const optionSchema = z.object({
  label: z.string().describe("Etiqueta para la opción"),
  id: z.string().describe("Identificador único para la opción"),
});

export const fieldSchema = z
  .object({
    type: z.enum([
      "text",
      "textarea",
      "password",
      "email",
      "number",
      "tel",
      "url",
      "date",
      "time",
      "checkbox",
      "radio",
      "file",
      "rating",
      "slider",
      "range",
    ]),
    name: z.string().describe("Identificador unico del campo en el formulario"),
    label: z.string().describe("Etiqueta visible para el campo"),
    placeholder: z.string().describe("Texto de ayuda dentro del campo"),
    required: z
      .boolean()
      .optional()
      .describe("Indica si el campo es obligatorio"),
    options: z
      .array(optionSchema)
      .nonempty()
      .optional()
      .describe("Lista de opciones para campos tipo 'radio' u 'options'"),
    min: z
      .number()
      .optional()
      .describe(
        "Valor mínimo para campos tipo 'number', 'rating', 'slider' o 'range'"
      ),
    max: z
      .number()
      .optional()
      .describe(
        "Valor máximo para campos tipo 'number', 'rating', 'slider' o 'range'"
      ),
    pattern: z
      .string()
      .optional()
      .describe("Expresión regular para validar el contenido del campo"),
    defaultValue: z
      .string()
      .optional()
      .describe("Valor predeterminado para el campo"),
  })
  .describe("Seccion que agrupa campos de relacionados a un tema");

export const sectionSchema = z.object({
  type: z.literal("section"),
  name: z
    .string()
    .describe("Identificador unico de la seccion en el formulario"),
  label: z.string().describe("Etiqueta visible para la sección"),
  placeholder: z.string().describe("Texto de ayuda dentro de la sección"),
  fields: z
    .array(fieldSchema)
    .nonempty()
    .describe("Lista de campos agrupados en la seccion"),
});

export const generatedFormSchema = z
  .array(sectionSchema)
  .describe("Lista de secciones");
