import type { ChatMessage } from "@/features/chat/types";

type JsonObject = Record<string, unknown>;

const API_BASE_URL = process.env.EXPO_PUBLIC_KONTINUE_API_URL?.replace(/\/$/, "") ?? "";
const MOBILE_CHAT_PATH = process.env.EXPO_PUBLIC_KONTINUE_CHAT_PATH ?? "/api/mobile/chat";

function toUrl(path: string): string | null {
  if (!API_BASE_URL) return null;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

async function postJson<T>(path: string, body: JsonObject): Promise<T | null> {
  const url = toUrl(path);
  if (!url) return null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function requestImportPreview(url: string): Promise<
  | {
      success: boolean;
      title?: string;
      provider?: string;
      transcript?: { messages?: Array<{ role: "system" | "user" | "assistant"; content: string }> };
      error?: string;
    }
  | null
> {
  return postJson("/api/import/preview", { url });
}

export async function requestCanvasGeneration(payload: {
  mode: "image" | "video";
  prompt: string;
  model: string;
  aspectRatio: string;
  duration?: number;
  quality?: "standard" | "pro";
  audio?: boolean;
}): Promise<{ mediaUrl?: string } | null> {
  const endpoint = payload.mode === "image" ? "/api/canvas/generate-image" : "/api/canvas/generate-video";
  return postJson(endpoint, payload);
}

export async function requestAssistantReply(payload: {
  model: string;
  webSearchEnabled: boolean;
  imageAspectRatio: string;
  imageSize: string | null;
  messages: ChatMessage[];
}): Promise<string | null> {
  const response = await postJson<{ reply?: string; message?: string }>(MOBILE_CHAT_PATH, payload as JsonObject);
  if (!response) return null;

  if (typeof response.reply === "string" && response.reply.trim()) {
    return response.reply;
  }

  if (typeof response.message === "string" && response.message.trim()) {
    return response.message;
  }

  return null;
}
