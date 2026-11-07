import { DemoChatProvider } from "./demoProvider";
import type { ChatProvider } from "./types";

export type {
  ChatCompletionRequest,
  ChatCompletionResponse,
  ChatMessage,
  ChatProvider,
  ChatRole,
} from "./types";

export {
  createChatMessage,
  createMessageId,
} from "./types";

export {
  buildDemoReply,
  demoSuggestedQuestions,
  demoWelcomeMessage,
  DemoChatProvider,
} from "./demoProvider";

/**
 * Active chat provider for the UI.
 * Future: return an OpenAI / custom provider when env + API route exist.
 * Do not hardcode secrets here.
 */
export function getChatProvider(): ChatProvider {
  return new DemoChatProvider();
}
