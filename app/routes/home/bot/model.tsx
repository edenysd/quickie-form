import type { ChatSession, Content } from "@google/generative-ai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { baseAgentInstruction } from "./instructions";
import { responseSchema } from "./responseSchema";

const apiKey = process.env.GOOGLE_GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: baseAgentInstruction,
});

const GENERATION_CONFIG = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
  responseSchema,
};

interface ChatSessionProps {
  history?: Content[];
  id: string;
}

const savedSessions = new Map<string, ChatSession>();

export async function createChatSession({ history = [] }: ChatSessionProps) {
  const chatSession = model.startChat({
    generationConfig: GENERATION_CONFIG,
    history,
  });
  return chatSession;
}
