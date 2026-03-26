import type { ModelOption } from "@/lib/models";

export const PERPLEXITY_MODELS: ModelOption[] = [
  { id: "perplexity/sonar", name: "Sonar", provider: "perplexity", description: "Fast and efficient" },
  { id: "perplexity/sonar-pro", name: "Sonar Pro", provider: "perplexity", description: "Advanced capabilities" },
  {
    id: "perplexity/sonar-reasoning",
    name: "Sonar Reasoning",
    provider: "perplexity",
    description: "Excellent reasoning",
  },
  {
    id: "perplexity/sonar-reasoning-pro",
    name: "Sonar Reasoning Pro",
    provider: "perplexity",
    description: "Excellent reasoning",
  },
];
