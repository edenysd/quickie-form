import type { Content, ChatSession } from "@google/generative-ai";
import { model, GENERATION_CONFIG } from "./model";

export type ChatHistory = Content[];
interface ChatSessionProps {
  fetchHistory: () => Promise<ChatHistory>;
  id: string;
}

const savedSessions = new Map<string, ChatSession>();

//@TODO remove unused cached items
export function getCachedChatSession(id: string): ChatSession | undefined {
  const sesion = savedSessions.get(id);
  return sesion;
}

export async function updateCachedChatSession({
  fetchHistory,
  id,
}: ChatSessionProps) {
  const cachedSession = savedSessions.get(id);
  if (cachedSession) {
    return;
  }

  const history = await fetchHistory();
  const chatSession = model.startChat({
    generationConfig: GENERATION_CONFIG,
    history,
  });
  savedSessions.set(id, chatSession);
}

export async function getLastMessageFromCachedChatSession(id: string) {
  return JSON.parse(
    (await getCachedChatSession(id)?.getHistory())?.at(-1)?.parts[0].text ||
      "[]"
  );
}
