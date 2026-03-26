import type { ModelOption } from "@/lib/models";

export const OPENAI_MODELS: ModelOption[] = [
  { id: "openai/gpt-5", name: "GPT-5", provider: "openai", description: "Most capable OpenAI model", isDefault: true },
  { id: "openai/gpt-5-pro", name: "GPT-5 Pro", provider: "openai", description: "Advanced capabilities" },
  { id: "openai/gpt-5.1-thinking", name: "GPT-5.1 Thinking", provider: "openai", description: "Advanced capabilities" },
  { id: "openai/gpt-5.1-instant", name: "GPT-5.1 Instant", provider: "openai", description: "Advanced capabilities" },
  { id: "openai/gpt-5.2", name: "GPT-5.2", provider: "openai", description: "Fast and efficient" },
  { id: "openai/gpt-5.2-pro", name: "GPT-5.2 Pro", provider: "openai", description: "Advanced capabilities" },
];
