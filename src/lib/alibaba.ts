import type { ModelOption } from "@/lib/models";

export const ALIBABA_MODELS: ModelOption[] = [
  { id: "alibaba/qwen3-coder", name: "Qwen3 Coder", provider: "alibaba", description: "Code focused" },
  { id: "alibaba/qwen3-coder-plus", name: "Qwen3 Coder Plus", provider: "alibaba", description: "Code focused" },
  { id: "alibaba/qwen3-max", name: "Qwen3 Max", provider: "alibaba", description: "Advanced capabilities" },
  {
    id: "alibaba/qwen3-max-thinking",
    name: "Qwen3 Max Thinking",
    provider: "alibaba",
    description: "Excellent reasoning",
  },
  {
    id: "alibaba/qwen3-max-preview",
    name: "Qwen3 Max Preview",
    provider: "alibaba",
    description: "Advanced capabilities",
  },
  { id: "alibaba/qwen-3-32b", name: "Qwen 3 32B", provider: "alibaba", description: "Advanced capabilities" },
  {
    id: "alibaba/qwen3-next-80b-a3b-instruct",
    name: "Qwen3 Next 80B A3B Instruct",
    provider: "alibaba",
    description: "Advanced capabilities",
  },
  {
    id: "alibaba/qwen3-next-80b-a3b-thinking",
    name: "Qwen3 Next 80B A3B Thinking",
    provider: "alibaba",
    description: "Excellent reasoning",
  },
  { id: "alibaba/qwen3-vl-instruct", name: "Qwen3 VL Instruct", provider: "alibaba", description: "Image capable" },
  { id: "alibaba/qwen3-vl-thinking", name: "Qwen3 VL Thinking", provider: "alibaba", description: "Image capable" },
];
