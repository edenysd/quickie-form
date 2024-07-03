import { FunctionDeclarationSchemaType } from "@google/generative-ai";

export const responseSchema = {
  type: FunctionDeclarationSchemaType.ARRAY,
  items: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      type: {
        type: FunctionDeclarationSchemaType.STRING,
        enum: [
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
          "options",
          "range",
          "file",
        ],
      },
      label: {
        type: FunctionDeclarationSchemaType.STRING,
        description: "Etiqueta visible para el campo",
      },
      placeholder: {
        type: FunctionDeclarationSchemaType.STRING,
        description: "Texto de ayuda dentro del campo",
      },
      required: {
        type: FunctionDeclarationSchemaType.BOOLEAN,
        description: "Indica si el campo es obligatorio",
      },
      options: {
        type: FunctionDeclarationSchemaType.ARRAY,
        items: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            label: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "Etiqueta para la opción",
            },
            id: {
              type: FunctionDeclarationSchemaType.STRING,
              description: "Identificador único para la opción",
            },
          },
        },
        description: "Lista de opciones para campos tipo 'radio' u 'options'",
      },
      min: {
        type: FunctionDeclarationSchemaType.NUMBER,
        description: "Valor mínimo para campos tipo 'number' o 'range'",
      },
      max: {
        type: FunctionDeclarationSchemaType.NUMBER,
        description: "Valor máximo para campos tipo 'number' o 'range'",
      },
      pattern: {
        type: FunctionDeclarationSchemaType.STRING,
        description: "Expresión regular para validar el contenido del campo",
      },
      defaultValue: {
        type: FunctionDeclarationSchemaType.STRING,
        description: "Valor predeterminado para el campo",
      },
      description: {
        type: FunctionDeclarationSchemaType.STRING,
        description: "Descripción adicional para el campo",
      },
    },
  },
};
