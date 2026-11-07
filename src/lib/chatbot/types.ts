/**
 * Provider-independent chat types.
 * Swap `DemoChatProvider` for a real AI provider later without changing the UI.
 */

export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
};

export type ChatCompletionRequest = {
  /** Full transcript including the latest user message. */
  messages: ChatMessage[];
};

export type ChatCompletionResponse = {
  message: ChatMessage;
};

export interface ChatProvider {
  /** Stable id — e.g. "demo" | "openai" | "custom". */
  id: string;
  displayName: string;
  /**
   * Produce the next assistant message.
   * Implementations may call a local rules engine or a remote model API.
   */
  complete(request: ChatCompletionRequest): Promise<ChatCompletionResponse>;
}

export function createMessageId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createChatMessage(
  role: ChatRole,
  content: string
): ChatMessage {
  return {
    id: createMessageId(),
    role,
    content,
    createdAt: Date.now(),
  };
}
