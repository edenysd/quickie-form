import { google } from "@ai-sdk/google";
import baseAgentInstruction from "./instructions.md?raw";

export const GENERATION_CONFIG = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const systemInstruction = baseAgentInstruction;

export const model = google("models/gemini-1.5-flash-latest", {
  ...GENERATION_CONFIG,
});
