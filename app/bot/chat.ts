import { generateForm } from "./model";
import type { User } from "@supabase/supabase-js";
import type {
  CoreAssistantMessage,
  CoreSystemMessage,
  CoreToolMessage,
  CoreUserMessage,
} from "ai";

export type MessageVariant =
  | CoreSystemMessage
  | CoreUserMessage
  | CoreAssistantMessage
  | CoreToolMessage;
export type ChatHistory = Array<MessageVariant>;
interface ChatSessionProps {
  fetchHistory: () => Promise<ChatHistory>;
  id: string;
}

const savedHistory = new Map<string, ChatHistory>();

export const getUserCachedId = (user: User | null) => `local-saved-${user?.id}`;

//@TODO think about changing to a non memory hoisted variant
export async function getCachedChatHistory(
  id: string
): Promise<ChatHistory | undefined> {
  const history = savedHistory.get(id);
  return history;
}

export async function updateCachedChatHistory({
  fetchHistory,
  id,
}: ChatSessionProps) {
  let history = await getCachedChatHistory(id);
  if (!history) {
    history = await fetchHistory();
  }
  savedHistory.set(id, history);

  return history;
}

export async function sendMessage({
  fetchHistory,
  id,
  messageContent,
}: ChatSessionProps & { messageContent: string }) {
  const history = await updateCachedChatHistory({ fetchHistory, id });
  const message: CoreUserMessage = { role: "user", content: messageContent };

  let response;

  try {
    response = await generateForm({ history: history.concat(message) });

    history.push(message);
    history.push({
      role: "assistant",
      content: JSON.stringify(response.object),
    });
  } catch (e) {
    if (e.cause) {
      console.error(e);
      response = await generateForm({
        history: history
          .concat(message)
          .concat({ role: "assistant", content: JSON.stringify(e.value) })
          .concat({
            role: "user",
            content: `Please, fix the json format in your response, if there exits a case where you don't
          know how to fix a section remove it, this is the error message:\n ${JSON.stringify(
            e.cause
          )}`,
          }),
      });
      history.push(message);
      history.push({
        role: "assistant",
        content: JSON.stringify(response.object),
      });
    } else {
      throw e;
    }
  }

  const formConfig = response.object;
  return { formConfig, history };
}

export async function removeCachedChatSession({ id }: { id: string }) {
  return savedHistory.delete(id);
}

export async function getLastMessageFromCachedChatSession(
  id: string
): Promise<MessageVariant | undefined> {
  return JSON.parse(
    (await getCachedChatHistory(id))?.at(-1)?.content as string
  );
}
