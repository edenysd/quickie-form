import {google} from '@ai-sdk/google';
import {generateObject} from 'ai';
import type {SummaryFormObjectType} from '~/utils/createSummaryFormObject';
import type {generatedFormSchema} from '../form-template/schemas';
import {z} from 'zod';
import type {StructuredFormDataEntry} from '~/utils/fromFormPlainNamesToObject';

export const GENERATION_CONFIG = {
  topP: 0.95,
  frequencyPenalty: 0
};

export const model = google('models/gemini-2-flash-latest', {
  topK: 64
});

const createSystemInstruction = (
  formConfig: z.infer<typeof generatedFormSchema>,
  surveyResponses: StructuredFormDataEntry[],
  summary: SummaryFormObjectType
) =>
  `The next JSON describes a form configuration, all of the insights responses
must use the same languaje that the informative fields:

${JSON.stringify(formConfig)}

All the next entries are individual responses to the described form.

${JSON.stringify(surveyResponses)}

Your are an expert matematician, the next JSON is a frequency analysis
calculated by you for every individual field in the form described. 

${JSON.stringify(summary)}

Your task is given the frequency analisis and all the individual responses 
to the form, give BEST deep and precise insights for every field in the form completing all the 
*summaryMessage* values in the frequency analysis. Be expresive in every field.

Return the completed insights allways follow the next directives:
 - Always use proper JSON format
 - Check suspicious inputs and report that cases
 - Be precise with the stats
 - Make your insights as large as possible if there are many things to say
 - ALWAYS use the same languaje that the form configuration, this is mandatory.
 Overrride any insights that not comply with this restriction
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
                    summaryMessage: z.string().min(30)
                  })
                ];
              })
            )
          )
        ];
      })
    )
  );
}

export const generateInsights = async ({
  summary,
  surveyResponses,
  formConfig
}: {
  summary: SummaryFormObjectType;
  surveyResponses: StructuredFormDataEntry[];
  formConfig: z.infer<typeof generatedFormSchema>;
}) => {
  const specificSchema = generateSurveySummarySchema(summary);
  try {
    const response = await generateObject({
      ...GENERATION_CONFIG,
      mode: 'json',
      model,
      schema: specificSchema,
      system: createSystemInstruction(formConfig, surveyResponses, summary),
      prompt:
        'Generate all the insights using the same languaje that the JSON form configuration'
    });
    return response;
  } catch (e) {
    console.log();
    const response = await generateObject({
      ...GENERATION_CONFIG,
      mode: 'json',
      model,
      schema: specificSchema,
      system: createSystemInstruction(formConfig, surveyResponses, summary),
      prompt: `Generate all the insights using the same languaje that the JSON form configuration. 
      This error needs to be fixed in your response ${e.cause}, always comply with the directives`
    });
    return response;
  }
};
