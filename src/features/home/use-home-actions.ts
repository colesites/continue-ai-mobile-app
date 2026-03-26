import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert } from "react-native";

import { useAppState } from "@/contexts/app-state-context";
import { MODEL_PROVIDER_MAP } from "@/features/home/model-provider-map";
import { getModelById } from "@/lib/models";
import { detectProvider, isSafeSharedLink } from "@/utils/url-safety";

export function useHomeActions() {
  const router = useRouter();
  const { createChat, importChatFromUrl, settings } = useAppState();

  const [selectedModel, setSelectedModel] = useState(settings.defaultModelId);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState("auto");
  const [imageSize, setImageSize] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [importUrl, setImportUrl] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const importProvider = useMemo(() => detectProvider(importUrl), [importUrl]);

  const startChatFromPrompt = async () => {
    const trimmed = prompt.trim();
    if (!trimmed || isCreatingChat) return;

    setIsCreatingChat(true);
    try {
      const modelProvider = getModelById(selectedModel)?.provider;
      const chatProvider = modelProvider
        ? MODEL_PROVIDER_MAP[modelProvider]
        : "unknown";

      const chatId = createChat({
        title: trimmed.slice(0, 60) || "New Conversation",
        provider: chatProvider,
        importMethod: "manual",
        messages: [],
      });

      setPrompt("");
      router.push({
        pathname: "/chat/[chatId]",
        params: {
          chatId,
          prefill: trimmed,
          model: selectedModel,
          webSearchEnabled: webSearchEnabled ? "1" : "0",
          imageAspectRatio,
          imageSize: imageSize ?? "",
        },
      });
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleImport = async () => {
    const trimmed = importUrl.trim();
    if (!trimmed) {
      Alert.alert(
        "Import link required",
        "Paste a shared link to import a conversation.",
      );
      return;
    }

    if (!isSafeSharedLink(trimmed)) {
      Alert.alert(
        "Invalid URL",
        "Use a valid HTTPS shared link from a supported provider.",
      );
      return;
    }

    setIsImporting(true);
    try {
      const result = await importChatFromUrl({
        url: trimmed,
        fallbackModelId: selectedModel,
      });

      setImportUrl("");
      router.push({
        pathname: "/chat/[chatId]",
        params: { chatId: result.chatId, imported: "1" },
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not import this chat link";
      Alert.alert("Import failed", message);
    } finally {
      setIsImporting(false);
    }
  };

  return {
    selectedModel,
    setSelectedModel,
    webSearchEnabled,
    setWebSearchEnabled,
    imageAspectRatio,
    setImageAspectRatio,
    imageSize,
    setImageSize,
    prompt,
    setPrompt,
    importUrl,
    setImportUrl,
    importProvider,
    isCreatingChat,
    isImporting,
    isInfoModalOpen,
    setIsInfoModalOpen,
    isImportModalOpen,
    setIsImportModalOpen,
    startChatFromPrompt,
    handleImport,
  };
}
