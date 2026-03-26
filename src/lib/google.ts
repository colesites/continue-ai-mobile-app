import type { ModelOption } from "@/lib/models";

export const GOOGLE_MODELS: ModelOption[] = [
  { id: "google/gemini-3-flash", name: "Gemini 3 Flash", provider: "google", description: "Latest Gemini model" },
  { id: "google/gemini-3-pro-preview", name: "Gemini 3 Pro Preview", provider: "google", description: "Advanced capabilities" },
  { id: "google/gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "google", description: "Advanced capabilities" },
  { id: "google/gemini-2.5-flash", name: "Gemini 2.5 Flash", provider: "google", description: "Fast and efficient" },
  { id: "google/gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", provider: "google", description: "Fast and efficient" },
  {
    id: "google/gemini-2.5-flash-lite-preview-09-2025",
    name: "Gemini 2.5 Flash Lite Preview (09-2025)",
    provider: "google",
    description: "Fast and efficient",
  },
  {
    id: "google/gemini-2.5-flash-preview-09-2025",
    name: "Gemini 2.5 Flash Preview (09-2025)",
    provider: "google",
    description: "Fast and efficient",
  },
  { id: "google/gemini-2.5-flash-image", name: "Gemini 2.5 Flash Image", provider: "google", description: "Image capable" },
  {
    id: "google/gemini-2.5-flash-image-preview",
    name: "Gemini 2.5 Flash Image Preview",
    provider: "google",
    description: "Image capable",
  },
  { id: "google/gemini-3-pro-image", name: "Gemini 3 Pro Image", provider: "google", description: "Image capable" },
];
