export type ModelCapability =
  | "text"
  | "image-generation"
  | "implicit-caching"
  | "explicit-caching"
  | "web-search"
  | "thinking"
  | "embedding";

type AiGatewayModel = {
  id: string;
  type?: "language" | "embedding" | "image" | string;
  tags?: string[];
  pricing?: Record<string, unknown>;
};

export function deriveIsPremium(model: AiGatewayModel): boolean {
  const caps = deriveCapabilities(model);
  return (
    caps.includes("image-generation") ||
    caps.includes("thinking") ||
    caps.includes("web-search") ||
    caps.includes("explicit-caching")
  );
}

export function deriveCapabilities(model: AiGatewayModel): ModelCapability[] {
  const caps = new Set<ModelCapability>();

  if (model.type === "language") caps.add("text");
  if (model.type === "embedding") caps.add("embedding");

  if (Array.isArray(model.tags)) {
    for (const tag of model.tags) {
      if (tag === "image-generation") caps.add("image-generation");
      if (tag === "implicit-caching") caps.add("implicit-caching");
      if (tag === "reasoning") caps.add("thinking");
    }
  }

  const pricing = model.pricing ?? {};
  if (pricing && typeof pricing === "object") {
    if ("input_cache_write" in pricing) caps.add("explicit-caching");

    const webSearch = (pricing as Record<string, unknown>).web_search;
    if (webSearch !== undefined && webSearch !== null && String(webSearch) !== "0") {
      caps.add("web-search");
    }

    if ("image" in pricing || "image_output" in pricing) {
      caps.add("image-generation");
    }
  }

  return Array.from(caps);
}

const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedModels: AiGatewayModel[] | null = null;
let cacheExpiry = 0;

export async function fetchAiGatewayModels(): Promise<AiGatewayModel[]> {
  const now = Date.now();
  if (cachedModels && now < cacheExpiry) {
    return cachedModels;
  }

  const response = await fetch("https://ai-gateway.vercel.sh/v1/models");
  if (!response.ok) {
    if (cachedModels) return cachedModels;
    throw new Error(`Failed to fetch AI Gateway models: ${response.status}`);
  }

  const json = (await response.json()) as { data?: AiGatewayModel[] };
  cachedModels = json.data ?? [];
  cacheExpiry = now + CACHE_TTL_MS;
  return cachedModels;
}
