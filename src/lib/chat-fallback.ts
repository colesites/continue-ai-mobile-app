import { getModelById } from "@/lib/models";

export function buildFallbackReply(args: {
  prompt: string;
  modelId: string;
  webSearchEnabled: boolean;
  imageAspectRatio: string;
  imageSize: string | null;
}): string {
  const { prompt, modelId, webSearchEnabled, imageAspectRatio, imageSize } = args;
  const model = getModelById(modelId);
  const modelLabel = model?.name ?? modelId;

  const trimmedPrompt = prompt.trim();
  const summary = trimmedPrompt.length > 220 ? `${trimmedPrompt.slice(0, 220).trimEnd()}...` : trimmedPrompt;

  return [
    `Continuing with ${modelLabel}.`,
    webSearchEnabled ? "Web search is enabled for this request." : "Web search is off for this request.",
    `Image ratio: ${imageAspectRatio}${imageSize ? `, size: ${imageSize}` : ""}.`,
    "",
    "This mobile app is wired for backend integration. Set `EXPO_PUBLIC_KONTINUE_API_URL` and a compatible chat endpoint to get live model responses.",
    "",
    `Prompt summary: ${summary}`,
  ].join("\n");
}
