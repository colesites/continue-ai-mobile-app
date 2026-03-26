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

export async function requestAssistantReply(
  payload: {
    model: string;
    webSearchEnabled: boolean;
    imageAspectRatio: string;
    imageSize: string | null;
    messages: ChatMessage[];
  },
  onChunk?: (chunk: string) => void,
): Promise<string | null> {
  const url = toUrl(MOBILE_CHAT_PATH);
  if (!url) return null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return null;

    if (!onChunk || !response.body) {
      const data = await response.json();
      return data.reply || data.message || null;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      onChunk(chunk);
    }

    return fullText;
  } catch (error) {
    console.error("Assistant reply error:", error);
    return null;
  }
}
