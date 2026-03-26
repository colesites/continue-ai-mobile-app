import { BLOCKED_HOSTNAMES, BLOCKED_IP_RANGES } from "@/utils/blocked-hosts";

export type Provider =
  | "chatgpt"
  | "claude"
  | "gemini"
  | "t3chat"
  | "perplexity"
  | "mistral"
  | "unknown";

export function isBlockedHost(hostname: string): boolean {
  const lowerHost = hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.includes(lowerHost)) {
    return true;
  }

  for (const pattern of BLOCKED_IP_RANGES) {
    if (pattern.test(lowerHost)) {
      return true;
    }
  }

  return false;
}

export function isSafeSharedLink(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return !isBlockedHost(parsed.hostname);
  } catch {
    return false;
  }
}

export function detectProvider(url: string): Provider {
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    switch (true) {
      case hostname.includes("chat.openai.com") || hostname.includes("chatgpt.com"):
        return "chatgpt";
      case hostname.includes("claude.ai") || hostname.includes("anthropic.com"):
        return "claude";
      case hostname.includes("gemini.google.com") || hostname.includes("aistudio.google.com"):
        return "gemini";
      case hostname.includes("t3chat.com"):
        return "t3chat";
      case hostname.includes("perplexity.ai"):
        return "perplexity";
      case hostname.includes("mistral.ai"):
        return "mistral";
      default:
        return "unknown";
    }
  } catch {
    return "unknown";
  }
}

export const PROVIDER_CONFIG: Record<Provider, { name: string; color: string }> = {
  chatgpt: { name: "ChatGPT", color: "#10a37f" },
  claude: { name: "Claude", color: "#cc785c" },
  gemini: { name: "Gemini", color: "#4285f4" },
  t3chat: { name: "T3Chat", color: "#f8e6f4" },
  perplexity: { name: "Perplexity", color: "#20b8cd" },
  mistral: { name: "Mistral", color: "#ffffff" },
  unknown: { name: "Unknown", color: "#64748b" },
};
