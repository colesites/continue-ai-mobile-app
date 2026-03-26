export type CanvasTab = "community" | "mine";

export interface CanvasCreation {
  id: string;
  mediaType: "image" | "video";
  prompt: string;
  modelId: string;
  provider: string;
  aspectRatio: string;
  duration?: number;
  quality?: "standard" | "pro";
  audio?: boolean;
  mediaUrl?: string;
  likes: number;
  published: boolean;
  owner: "me" | "community";
  createdAt: number;
}
