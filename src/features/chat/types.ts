export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  modelId?: string;
  isImported?: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  provider: string;
  importMethod: "manual" | "automatic";
  sourceUrl?: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
}

export type ChatSendState = "idle" | "sending";
