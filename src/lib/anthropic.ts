import type { ModelOption } from "@/lib/models";

export const ANTHROPIC_MODELS: ModelOption[] = [
  { id: "anthropic/claude-sonnet-4", name: "Claude Sonnet 4", provider: "anthropic", description: "Advanced capabilities" },
  { id: "anthropic/claude-opus-4", name: "Claude Opus 4", provider: "anthropic", description: "Advanced capabilities" },
  { id: "anthropic/claude-opus-4.1", name: "Claude Opus 4.1", provider: "anthropic", description: "Excellent reasoning" },
  { id: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5", provider: "anthropic", description: "Fast responses" },
  { id: "anthropic/claude-sonnet-4.5", name: "Claude Sonnet 4.5", provider: "anthropic", description: "Advanced capabilities" },
  { id: "anthropic/claude-opus-4.5", name: "Claude Opus 4.5", provider: "anthropic", description: "Advanced capabilities" },
  { id: "anthropic/claude-opus-4.6", name: "Claude Opus 4.6", provider: "anthropic", description: "Advanced capabilities" },
  { id: "anthropic/claude-3.7-sonnet", name: "Claude 3.7 Sonnet", provider: "anthropic", description: "Excellent reasoning" },
  { id: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", provider: "anthropic", description: "Fast responses" },
  { id: "anthropic/claude-3-haiku", name: "Claude 3 Haiku", provider: "anthropic", description: "Fast responses" },
];
