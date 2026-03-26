import type { ModelOption } from "@/lib/models";

export const MISTRAL_MODELS: ModelOption[] = [
  { id: "mistral/devstral-2", name: "Devstral 2", provider: "mistral", description: "Advanced capabilities" },
  { id: "mistral/ministral-3b", name: "Ministral 3B", provider: "mistral", description: "Fast and efficient" },
  { id: "mistral/mistral-embed", name: "Mistral Embed", provider: "mistral", description: "Embeddings" },
  { id: "mistral/mistral-nemo", name: "Mistral Nemo", provider: "mistral", description: "Advanced capabilities" },
  { id: "mistral/ministral-8b", name: "Ministral 8B", provider: "mistral", description: "Fast and efficient" },
  {
    id: "mistral/devstral-small-2",
    name: "Devstral Small 2",
    provider: "mistral",
    description: "Fast responses",
  },
  { id: "mistral/mistral-medium", name: "Mistral Medium", provider: "mistral", description: "Advanced capabilities" },
  {
    id: "mistral/mistral-large-3",
    name: "Mistral Large 3",
    provider: "mistral",
    description: "Most capable Mistral model",
  },
  { id: "mistral/ministral-14b", name: "Ministral 14B", provider: "mistral", description: "Advanced capabilities" },
  { id: "mistral/codestral", name: "Codestral", provider: "mistral", description: "Code focused" },
  { id: "mistral/codestral-embed", name: "Codestral Embed", provider: "mistral", description: "Embeddings" },
  { id: "mistral/mistral-small", name: "Mistral Small", provider: "mistral", description: "Fast and efficient" },
  { id: "mistral/devstral-small", name: "Devstral Small", provider: "mistral", description: "Fast responses" },
  { id: "mistral/pixtral-large", name: "Pixtral Large", provider: "mistral", description: "Image capable" },
  {
    id: "mistral/magistral-medium",
    name: "Magistral Medium",
    provider: "mistral",
    description: "Advanced capabilities",
  },
  {
    id: "mistral/magistral-small",
    name: "Magistral Small",
    provider: "mistral",
    description: "Fast and efficient",
  },
  { id: "mistral/pixtral-12b", name: "Pixtral 12B", provider: "mistral", description: "Image capable" },
];
