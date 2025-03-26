import {google} from '@ai-sdk/google';
import baseAgentInstruction from './instructions.md?raw';
import {generateObject} from 'ai';
import {generatedFormSchema} from './schemas';
import type {ChatHistory} from './chat';

export const GENERATION_CONFIG = {
  topP: 0.95,
  maxTokens: 2000,
  frequencyPenalty: 0
};

export const systemInstruction = baseAgentInstruction;

export const model = google('models/gemini-2-flash-latest', {
  topK: 64
});

export const generateForm = async ({history}: {history: ChatHistory}) => {
  return await generateObject({
    ...GENERATION_CONFIG,
    mode: 'json',
    model,
    schema: generatedFormSchema,
    system: systemInstruction,
    messages: history
  });
};
