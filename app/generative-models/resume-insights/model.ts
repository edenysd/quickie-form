import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import type { SummaryFormObjectType } from "~/utils/createSummaryFormObject";
import type { generatedFormSchema } from "../form-template/schemas";
import { z } from "zod";
import type { StructuredFormDataEntry } from "~/utils/fromFormPlainNamesToObject";

export const GENERATION_CONFIG = {
  topP: 0.95,
  frequencyPenalty: 0,
};

export const model = google("models/gemini-1.5-flash-latest", {
  topK: 64,
});

const createSystemInstruction = (
  formConfig: z.infer<typeof generatedFormSchema>,
  surveyResponses: StructuredFormDataEntry[],
  summary: SummaryFormObjectType
) =>
  `The next JSON describes a form configuration:

${JSON.stringify(formConfig)}

All the next entries are individual responses to the described form

${JSON.stringify(surveyResponses)}

Your are an expert matematician, the next JSON is a frequency analysis
calculated by you for every individual field in the form described. Your task is given
the frequency analisis and all the individual responses to the form, give top
deep and precise insights for every field in the form completing all the 
*summaryMessage* values in the frequency analysis and return the frequency analysis
fully completed.

${JSON.stringify(summary)}

Return the completed insights allways follow the next directives:
 - Always use proper JSON format
 - Always try to extract all meaningfull insights
 - Check suspicious inputs
 - Be precise with the stats
 - Make your insights large if there are many things to say
`;

function generateSurveySummarySchema(summary: SummaryFormObjectType) {
  return z.object(
    Object.fromEntries(
      Object.entries(summary).map((entrieSection) => {
        return [
          entrieSection[0],
          z.object(
            Object.fromEntries(
              Object.entries(entrieSection[1]).map((entrieField) => {
                return [
                  entrieField[0],
                  z.object({
                    summaryMessage: z.string().min(30),
                  }),
                ];
              })
            )
          ),
        ];
      })
    )
  );
}

export const generateInsights = async ({
  summary,
  surveyResponses,
  formConfig,
}: {
  summary: SummaryFormObjectType;
  surveyResponses: StructuredFormDataEntry[];
  formConfig: z.infer<typeof generatedFormSchema>;
}) => {
  const specificSchema = generateSurveySummarySchema(summary);
  try {
    const response = await generateObject({
      ...GENERATION_CONFIG,
      mode: "json",
      model,
      schema: specificSchema,
      prompt: createSystemInstruction(formConfig, surveyResponses, summary),
    });
    return response;
  } catch (e) {
    const response = await generateObject({
      ...GENERATION_CONFIG,
      mode: "json",
      model,
      schema: specificSchema,
      prompt:
        createSystemInstruction(formConfig, surveyResponses, summary) +
        `\nThis error needs to be fixed in your response ${e.cause}`,
    });
    return response;
  }
};
