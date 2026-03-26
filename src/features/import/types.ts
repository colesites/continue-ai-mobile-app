import type { Provider } from "@/utils/url-safety";

export interface NormalizedMessage {
  role: "system" | "user" | "assistant";
  content: string;
  author?: string;
  createdAt?: number;
  order: number;
}

export interface NormalizedTranscript {
  provider: string;
  title: string;
  messages: NormalizedMessage[];
  sourceUrl?: string;
  fetchedAt: number;
}

export interface ImportPreviewResponse {
  success: boolean;
  provider: Provider;
  title: string;
  messageCount: number;
  previewMessages: NormalizedMessage[];
  transcript?: NormalizedTranscript;
  error?: string;
  requiresManualPaste?: boolean;
}
