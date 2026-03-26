import { useMemo, useState } from "react";
import { useAppState } from "@/contexts/app-state-context";
import { DEFAULT_IMAGE_MODEL, DEFAULT_VIDEO_MODEL } from "@/lib/canvas-models";

export function useCanvasScreen() {
  const {
    settings,
    canvasCreations,
    addCanvasCreation,
    toggleCanvasLike,
    toggleCanvasPublish,
  } = useAppState();

  const [tab, setTab] = useState<"community" | "mine">("community");
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<"image" | "video">("image");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [modelId, setModelId] = useState(DEFAULT_IMAGE_MODEL);
  const [duration, setDuration] = useState(5);
  const [quality, setQuality] = useState<"standard" | "pro">("standard");
  const [audio, setAudio] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const displayCreations = useMemo(
    () =>
      canvasCreations
        .filter((creation) => (tab === "community" ? creation.published || creation.owner === "community" : creation.owner === "me"))
        .sort((a, b) => b.createdAt - a.createdAt),
    [canvasCreations, tab],
  );

  const handleModeChange = (nextMode: "image" | "video") => {
    setMode(nextMode);
    setModelId(nextMode === "image" ? DEFAULT_IMAGE_MODEL : DEFAULT_VIDEO_MODEL);
  };

  const handleGenerate = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || isGenerating) return;

    setIsGenerating(true);
    try {
      await addCanvasCreation({
        mode,
        prompt: trimmed,
        modelId,
        aspectRatio,
        duration,
        quality,
        audio,
      });
      setPrompt("");
      setTab("mine");
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    tab,
    setTab,
    prompt,
    setPrompt,
    mode,
    handleModeChange,
    aspectRatio,
    setAspectRatio,
    modelId,
    setModelId,
    duration,
    setDuration,
    quality,
    setQuality,
    audio,
    setAudio,
    isGenerating,
    handleGenerate,
    displayCreations,
    toggleCanvasLike,
    toggleCanvasPublish,
    planTier: settings.planTier,
  };
}
