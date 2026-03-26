import { useChat } from "@ai-sdk/react";
import { useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useAppState } from "@/contexts/app-state-context";
import { createId } from "@/lib/id";

const API_BASE_URL = process.env.EXPO_PUBLIC_KONTINUE_API_URL?.replace(/\/$/, "") ?? "";
const MOBILE_CHAT_PATH = process.env.EXPO_PUBLIC_KONTINUE_CHAT_PATH ?? "/api/mobile/chat";

export function useChatScreen() {
  const params = useLocalSearchParams<{
    chatId?: string;
    prefill?: string;
    model?: string;
    webSearchEnabled?: string;
    imageAspectRatio?: string;
    imageSize?: string;
  }>();

  const { getChat, settings } = useAppState();

  const chatId = params.chatId ?? "";
  const chat = getChat(chatId);

  const selectedModel = params.model ?? settings.defaultModelId;
  const webSearchEnabled = params.webSearchEnabled === "1";
  const imageAspectRatio = params.imageAspectRatio ?? "auto";
  const imageSize = params.imageSize || null;

  // AI SDK's useChat hook integration
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    stop,
    reload,
    append,
  } = useChat({
    api: `${API_BASE_URL}${MOBILE_CHAT_PATH}`,
    initialMessages: chat?.messages?.map((m) => ({
      id: m.id,
      role: m.role as any,
      content: m.content,
      createdAt: new Date(m.createdAt),
    })) || [],
    body: {
      chatId,
      model: selectedModel,
      webSearchEnabled,
      imageAspectRatio,
      imageSize,
    },
    onResponse: (response) => {
      if (!response.ok) {
        Alert.alert("Chat Error", "Could not connect to the assistant.");
      }
    },
    onFinish: (message) => {
      // Sync finished message back to local/convex if needed
      console.log("Chat finished:", message);
    },
    onError: (error) => {
      console.error("Chat SDK Error:", error);
      Alert.alert("Chat Error", "Something went wrong during the conversation.");
    },
  });

  // Prefill logic
  useEffect(() => {
    const prefill = typeof params.prefill === "string" ? params.prefill : "";
    if (!prefill || !chatId || !chat || isLoading) return;
    if ((chat.messages?.length ?? 0) > 0 || messages.length > 0) return;

    append({
      id: createId("msg"),
      role: "user",
      content: prefill,
    });
  }, [chatId, params.prefill, chat, messages.length, isLoading, append]);

  const onSend = async () => {
    if (!input.trim() || isLoading) return;
    handleSubmit();
  };

  return {
    chat,
    messages,
    draft: input,
    setDraft: setInput,
    selectedModel,
    webSearchEnabled,
    imageAspectRatio,
    imageSize,
    isSending: isLoading,
    onSend,
    stop,
    reload,
    append,
  };
}
