export const MessageAuthor = {
  USER: "user",
  ASSISTANT: "assistant",
} as const;

export type MessageAuthor = (typeof MessageAuthor)[keyof typeof MessageAuthor];
