import { generateForm } from "./model";
import type { User } from "@supabase/supabase-js";
import type {
  CoreAssistantMessage,
  CoreSystemMessage,
  CoreToolMessage,
  CoreUserMessage,
} from "ai";
import { generatedFormSchema } from "./schemas";

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

  let formConfig = [];

  try {
    const response = await generateForm({ history: history.concat(message) });
    formConfig = response.object;
  } catch (e) {
    /* 
      Manually checked validation errors because forced bifurcation in data source and errors.

      Ex: When error name is "AI_APICallError" the Zod schema throw a non useful error
      then we decide to manually extract the response and validate in a more lean process
     */
    let errorDataValue = null;
    if (e.name === "AI_APICallError") {
      errorDataValue = JSON.parse(e.responseBody).candidates[0].content.parts[0]
        .text;
      if (!errorDataValue || errorDataValue?.length == 0) errorDataValue = [];
      console.log(errorDataValue, errorDataValue.length);
    } else if (e.cause) {
      errorDataValue = e.value;
    } else {
      throw e;
    }

    const responseValidation = generatedFormSchema.safeParse(errorDataValue);
    if (responseValidation.success) {
      formConfig = responseValidation.data;
    } else {
      const response = await generateForm({
        history: history
          .concat(message)
          .concat({
            role: "assistant",
            content: JSON.stringify(errorDataValue),
          })
          .concat({
            role: "user",
            content: `Please, fix the json format in your latest response, this is the error message:\n ${JSON.stringify(
              e.cause
            )}`,
          }),
      });

      formConfig = response.object;
    }
  }

  history.push(message);
  history.push({
    role: "assistant",
    content: JSON.stringify(formConfig),
  });
  return { formConfig, history };
}

export async function removeCachedChatSession({ id }: { id: string }) {
  return savedHistory.delete(id);
}

export async function getLastMessageFromCachedChatSession(
  id: string
): Promise<MessageVariant> {
  return JSON.parse(
    ((await getCachedChatHistory(id))?.at(-1)?.content as string) || "[]"
  );
}
