import { generateForm } from "./model";
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

export async function sendMessage({
  history,
  messageContent,
}: {
  history: ChatHistory;
  messageContent: string;
}) {
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
      errorDataValue = JSON.parse(e.responseBody).candidates[0].content
        ?.parts[0].text;
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
