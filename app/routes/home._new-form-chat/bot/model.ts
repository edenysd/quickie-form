import { GoogleGenerativeAI } from "@google/generative-ai";
import baseAgentInstruction from "./instructions.md?raw";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: baseAgentInstruction,
});

export const GENERATION_CONFIG = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};
