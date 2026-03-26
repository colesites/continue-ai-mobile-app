import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";

import { useAppState } from "@/contexts/app-state-context";

export function useChatScreen() {
  const params = useLocalSearchParams<{
    chatId?: string;
    prefill?: string;
    model?: string;
    webSearchEnabled?: string;
    imageAspectRatio?: string;
    imageSize?: string;
  }>();

  const { getChat, sendMessage, chatSendingById, settings } = useAppState();

  const chatId = params.chatId ?? "";
  const chat = getChat(chatId);

  const [draft, setDraft] = useState("");
  const [selectedModel, setSelectedModel] = useState(params.model ?? settings.defaultModelId);
  const [webSearchEnabled, setWebSearchEnabled] = useState(params.webSearchEnabled === "1");
  const [imageAspectRatio, setImageAspectRatio] = useState(params.imageAspectRatio ?? "auto");
  const [imageSize, setImageSize] = useState<string | null>(params.imageSize || null);

  useEffect(() => {
    const prefill = typeof params.prefill === "string" ? params.prefill : "";
    if (!prefill || !chatId || !chat) return;
    if (chat.messages.length > 0) return;

    void sendMessage({
      chatId,
      prompt: prefill,
      modelId: selectedModel,
      webSearchEnabled,
      imageAspectRatio,
      imageSize,
    });
  }, [
    chat,
    chatId,
    imageAspectRatio,
    imageSize,
    params.prefill,
    selectedModel,
    sendMessage,
    webSearchEnabled,
  ]);

  const isSending = useMemo(() => !!chatSendingById[chatId], [chatId, chatSendingById]);

  const onSend = async () => {
    if (!chatId || !draft.trim()) return;

    const nextPrompt = draft;
    setDraft("");

    await sendMessage({
      chatId,
      prompt: nextPrompt,
      modelId: selectedModel,
      webSearchEnabled,
      imageAspectRatio,
      imageSize,
    });
  };

  return {
    chat,
    draft,
    setDraft,
    selectedModel,
    setSelectedModel,
    webSearchEnabled,
    setWebSearchEnabled,
    imageAspectRatio,
    setImageAspectRatio,
    imageSize,
    setImageSize,
    isSending,
    onSend,
  };
}
