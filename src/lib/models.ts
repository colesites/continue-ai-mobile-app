import { OPENAI_MODELS } from "@/lib/openai";
import { ANTHROPIC_MODELS } from "@/lib/anthropic";
import { GOOGLE_MODELS } from "@/lib/google";
import { DEEPSEEK_MODELS } from "@/lib/deepseek";
import { MINIMAX_MODELS } from "@/lib/minimax";
import { MISTRAL_MODELS } from "@/lib/mistral";
import { PERPLEXITY_MODELS } from "@/lib/perplexity";
import { ZAI_MODELS } from "@/lib/zai";
import { ALIBABA_MODELS } from "@/lib/alibaba";

export interface ModelOption {
  id: string;
  name: string;
  provider:
    | "openai"
    | "anthropic"
    | "google"
    | "deepseek"
    | "minimax"
    | "mistral"
    | "perplexity"
    | "zai"
    | "alibaba";
  description: string;
  isDefault?: boolean;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  ...OPENAI_MODELS,
  ...ANTHROPIC_MODELS,
  ...GOOGLE_MODELS,
  ...DEEPSEEK_MODELS,
  ...MINIMAX_MODELS,
  ...MISTRAL_MODELS,
  ...PERPLEXITY_MODELS,
  ...ZAI_MODELS,
  ...ALIBABA_MODELS,
];

export const FREE_DEFAULT_MODEL_ID = "deepseek/deepseek-v3.2";
export const PRO_DEFAULT_MODEL_ID = "openai/gpt-5.2-pro";

export const ALWAYS_FREE_MODEL_IDS = new Set<string>([
  FREE_DEFAULT_MODEL_ID,
  "alibaba/wan-v2.6-t2v",
  "alibaba/wan-v2.6-i2v",
  "alibaba/wan-v2.6-i2v-flash",
  "alibaba/wan-v2.6-r2v",
  "alibaba/wan-v2.6-r2v-flash",
  "alibaba/wan-v2.5-t2v-preview",
]);

export function getModelById(id: string): ModelOption | undefined {
  return AVAILABLE_MODELS.find((model) => model.id === id);
}

export function getDefaultModel(): ModelOption {
  return getModelById(FREE_DEFAULT_MODEL_ID) ?? AVAILABLE_MODELS.find((model) => model.isDefault) ?? AVAILABLE_MODELS[0];
}

export function getDefaultModelForPlan(isPro: boolean): ModelOption {
  const preferred = isPro ? PRO_DEFAULT_MODEL_ID : FREE_DEFAULT_MODEL_ID;
  return getModelById(preferred) ?? getDefaultModel();
}

export function getProviderColor(provider: ModelOption["provider"]): string {
  const colors = {
    openai: "#10a37f",
    anthropic: "#cc785c",
    google: "#4285f4",
    deepseek: "#3b82f6",
    minimax: "#a855f7",
    mistral: "#ffffff",
    perplexity: "#20b8cd",
    zai: "#f97316",
    alibaba: "#ef4444",
  };

  return colors[provider];
}
