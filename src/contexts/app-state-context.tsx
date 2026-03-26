import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";
import { Alert } from "react-native";

import { createId } from "@/lib/id";
import { getDefaultModelForPlan, getModelById } from "@/lib/models";
import { MODEL_PROVIDER_MAP } from "@/features/home/model-provider-map";
import type { ChatMessage, ChatThread } from "@/features/chat/types";
import type { CanvasCreation } from "@/features/canvas/types";
import type { FeedbackPost } from "@/features/feedback/types";
import type { PlanTier } from "@/lib/plan-tier";
import { isPaidTier } from "@/lib/plan-tier";
import { getSavedSpeechLanguage, setSavedSpeechLanguage } from "@/lib/speech-settings";
import { requestAssistantReply, requestCanvasGeneration, requestImportPreview } from "@/lib/api-client";
import { buildFallbackReply } from "@/lib/chat-fallback";

export type AppSettings = {
  speechLanguage: string;
  planTier: PlanTier;
  defaultModelId: string;
};

type SendMessageOptions = {
  chatId: string;
  prompt: string;
  modelId: string;
  webSearchEnabled: boolean;
  imageAspectRatio: string;
  imageSize: string | null;
};

type ImportOptions = {
  url: string;
  fallbackModelId: string;
};

type CreateCanvasOptions = {
  mode: "image" | "video";
  prompt: string;
  modelId: string;
  aspectRatio: string;
  duration?: number;
  quality?: "standard" | "pro";
  audio?: boolean;
};

type AppStateContextValue = {
  chats: ChatThread[];
  canvasCreations: CanvasCreation[];
  feedbackPosts: FeedbackPost[];
  settings: AppSettings;
  chatSendingById: Record<string, boolean>;
  createChat: (args: {
    title: string;
    provider: string;
    importMethod: "manual" | "automatic";
    sourceUrl?: string;
    messages?: ChatMessage[];
  }) => string;
  updateChat: (chatId: string, updater: (chat: ChatThread) => ChatThread) => void;
  getChat: (chatId: string) => ChatThread | undefined;
  getRecentChats: () => ChatThread[];
  sendMessage: (args: SendMessageOptions) => Promise<void>;
  importChatFromUrl: (args: ImportOptions) => Promise<{ chatId: string; importedCount: number }>;
  setPlanTier: (tier: PlanTier) => void;
  setSpeechLanguage: (language: string) => void;
  setDefaultModel: (modelId: string) => void;
  addCanvasCreation: (options: CreateCanvasOptions) => Promise<CanvasCreation | null>;
  toggleCanvasLike: (creationId: string) => void;
  toggleCanvasPublish: (creationId: string) => void;
  createFeedbackPost: (input: { title: string; details: string; type: "feature" | "bug" }) => boolean;
  voteFeedbackPost: (postId: string, direction: "up" | "down") => void;
  addFeedbackComment: (postId: string, body: string) => boolean;
};

const AppStateContext = createContext<AppStateContextValue | null>(null);

function createSeedFeedbackPosts(): FeedbackPost[] {
  return [
    {
      id: createId("post"),
      title: "Native push notifications for import completion",
      details: "Notify users when background import is done so they can jump right into the chat.",
      type: "feature",
      score: 24,
      createdAt: Date.now() - 1000 * 60 * 60 * 26,
      comments: [],
      myVote: null,
    },
    {
      id: createId("post"),
      title: "Fix keyboard overlap in long chat threads",
      details: "Composer should stay above the keyboard and keep the newest message visible.",
      type: "bug",
      score: 14,
      createdAt: Date.now() - 1000 * 60 * 60 * 8,
      comments: [],
      myVote: null,
    },
  ];
}

function createSeedCanvasCreations(): CanvasCreation[] {
  return [
    {
      id: createId("canvas"),
      mediaType: "image",
      prompt: "A cyberpunk city street with rain reflections and neon signs",
      modelId: "google/gemini-3-pro-image",
      provider: "Google",
      aspectRatio: "16:9",
      likes: 64,
      published: true,
      owner: "community",
      createdAt: Date.now() - 1000 * 60 * 60 * 10,
    },
    {
      id: createId("canvas"),
      mediaType: "video",
      prompt: "Slow dolly shot of futuristic Lagos skyline at sunrise",
      modelId: "google/veo-3.1-generate-001",
      provider: "Google",
      aspectRatio: "16:9",
      duration: 10,
      quality: "pro",
      audio: true,
      likes: 37,
      published: true,
      owner: "community",
      createdAt: Date.now() - 1000 * 60 * 60 * 36,
    },
  ];
}

export function AppStateProvider({ children }: PropsWithChildren) {
  const initialTier: PlanTier = "free";
  const [settings, setSettings] = useState<AppSettings>({
    speechLanguage: getSavedSpeechLanguage(),
    planTier: initialTier,
    defaultModelId: getDefaultModelForPlan(false).id,
  });

  const [chats, setChats] = useState<ChatThread[]>([]);
  const [canvasCreations, setCanvasCreations] = useState<CanvasCreation[]>(createSeedCanvasCreations);
  const [feedbackPosts, setFeedbackPosts] = useState<FeedbackPost[]>(createSeedFeedbackPosts);
  const [chatSendingById, setChatSendingById] = useState<Record<string, boolean>>({});

  const updateChat = useCallback((chatId: string, updater: (chat: ChatThread) => ChatThread) => {
    setChats((previous) => previous.map((chat) => (chat.id === chatId ? updater(chat) : chat)));
  }, []);

  const createChat = useCallback(
    (args: {
      title: string;
      provider: string;
      importMethod: "manual" | "automatic";
      sourceUrl?: string;
      messages?: ChatMessage[];
    }) => {
      const chatId = createId("chat");
      const now = Date.now();

      const next: ChatThread = {
        id: chatId,
        title: args.title,
        provider: args.provider,
        importMethod: args.importMethod,
        sourceUrl: args.sourceUrl,
        createdAt: now,
        updatedAt: now,
        messages: args.messages ?? [],
      };

      setChats((previous) => [next, ...previous]);
      return chatId;
    },
    [],
  );

  const getChat = useCallback((chatId: string) => chats.find((chat) => chat.id === chatId), [chats]);

  const getRecentChats = useCallback(
    () => [...chats].sort((a, b) => b.updatedAt - a.updatedAt),
    [chats],
  );

  const appendMessage = useCallback((chatId: string, message: ChatMessage) => {
    updateChat(chatId, (chat) => {
      const title =
        chat.title === "New Conversation" && message.role === "user"
          ? message.content.slice(0, 60)
          : chat.title;

      return {
        ...chat,
        title,
        updatedAt: message.createdAt,
        messages: [...chat.messages, message],
      };
    });
  }, [updateChat]);

  const sendMessage = useCallback(
    async ({ chatId, prompt, modelId, webSearchEnabled, imageAspectRatio, imageSize }: SendMessageOptions) => {
      const trimmed = prompt.trim();
      if (!trimmed) return;

      const chat = getChat(chatId);
      if (!chat) return;

      setChatSendingById((previous) => ({ ...previous, [chatId]: true }));

      const userMessage: ChatMessage = {
        id: createId("msg"),
        role: "user",
        content: trimmed,
        createdAt: Date.now(),
        modelId,
      };

      appendMessage(chatId, userMessage);

      try {
        const latestChat = getChat(chatId);
        const messagesForApi = latestChat ? [...latestChat.messages, userMessage] : [userMessage];

        const backendReply = await requestAssistantReply({
          model: modelId,
          webSearchEnabled,
          imageAspectRatio,
          imageSize,
          messages: messagesForApi,
        });

        const assistantMessage: ChatMessage = {
          id: createId("msg"),
          role: "assistant",
          content:
            backendReply ??
            buildFallbackReply({
              prompt: trimmed,
              modelId,
              webSearchEnabled,
              imageAspectRatio,
              imageSize,
            }),
          createdAt: Date.now(),
          modelId,
        };

        appendMessage(chatId, assistantMessage);
      } finally {
        setChatSendingById((previous) => ({ ...previous, [chatId]: false }));
      }
    },
    [appendMessage, getChat],
  );

  const importChatFromUrl = useCallback(
    async ({ url, fallbackModelId }: ImportOptions) => {
      const providerFromModel = getModelById(fallbackModelId)?.provider;
      const provider = providerFromModel ? MODEL_PROVIDER_MAP[providerFromModel] : "unknown";

      const chatId = createChat({
        title: "Importing conversation...",
        provider,
        sourceUrl: url,
        importMethod: "automatic",
        messages: [],
      });

      const preview = await requestImportPreview(url);
      const importedMessages =
        preview?.transcript?.messages?.map((message) => ({
          id: createId("msg"),
          role: message.role,
          content: message.content,
          createdAt: Date.now(),
          isImported: true,
          modelId: fallbackModelId,
        })) ?? [];

      if (importedMessages.length === 0) {
        updateChat(chatId, (chat) => ({
          ...chat,
          title: "Imported conversation",
          updatedAt: Date.now(),
          messages: [
            ...chat.messages,
            {
              id: createId("msg"),
              role: "assistant",
              content:
                preview?.error ??
                "Could not auto-parse this share link. You can continue the chat manually from mobile.",
              createdAt: Date.now(),
              isImported: true,
            },
          ],
        }));

        return { chatId, importedCount: 0 };
      }

      updateChat(chatId, (chat) => ({
        ...chat,
        title: preview?.title?.trim() || chat.title || "Imported conversation",
        updatedAt: Date.now(),
        messages: importedMessages,
      }));

      return { chatId, importedCount: importedMessages.length };
    },
    [createChat, updateChat],
  );

  const setPlanTier = useCallback((tier: PlanTier) => {
    setSettings((previous) => {
      const nextDefault = getDefaultModelForPlan(isPaidTier(tier)).id;
      return {
        ...previous,
        planTier: tier,
        defaultModelId: nextDefault,
      };
    });
  }, []);

  const setSpeechLanguage = useCallback((language: string) => {
    const normalized = setSavedSpeechLanguage(language);
    setSettings((previous) => ({ ...previous, speechLanguage: normalized }));
  }, []);

  const setDefaultModel = useCallback((modelId: string) => {
    if (!getModelById(modelId)) return;
    setSettings((previous) => ({ ...previous, defaultModelId: modelId }));
  }, []);

  const addCanvasCreation = useCallback(
    async ({ mode, prompt, modelId, aspectRatio, duration, quality, audio }: CreateCanvasOptions) => {
      const isPaid = isPaidTier(settings.planTier);

      if (mode === "image" && !isPaid) {
        Alert.alert("Upgrade required", "Starter or Pro is required for image generation.");
        return null;
      }

      if (mode === "video" && settings.planTier !== "pro") {
        Alert.alert("Upgrade required", "Pro is required for video generation.");
        return null;
      }

      const provider = getModelById(modelId)?.provider ?? "unknown";
      const generation = await requestCanvasGeneration({
        mode,
        prompt,
        model: modelId,
        aspectRatio,
        duration,
        quality,
        audio,
      });

      const creation: CanvasCreation = {
        id: createId("canvas"),
        mediaType: mode,
        prompt,
        modelId,
        provider,
        aspectRatio,
        duration,
        quality,
        audio,
        mediaUrl: generation?.mediaUrl,
        likes: 0,
        published: false,
        owner: "me",
        createdAt: Date.now(),
      };

      setCanvasCreations((previous) => [creation, ...previous]);
      return creation;
    },
    [settings.planTier],
  );

  const toggleCanvasLike = useCallback((creationId: string) => {
    setCanvasCreations((previous) =>
      previous.map((creation) =>
        creation.id === creationId
          ? {
              ...creation,
              likes: creation.likes + 1,
            }
          : creation,
      ),
    );
  }, []);

  const toggleCanvasPublish = useCallback((creationId: string) => {
    setCanvasCreations((previous) =>
      previous.map((creation) =>
        creation.id === creationId
          ? {
              ...creation,
              published: !creation.published,
            }
          : creation,
      ),
    );
  }, []);

  const createFeedbackPost = useCallback((input: { title: string; details: string; type: "feature" | "bug" }) => {
    const title = input.title.trim();
    const details = input.details.trim();

    if (!title || !details) return false;

    const post: FeedbackPost = {
      id: createId("post"),
      title,
      details,
      type: input.type,
      score: 0,
      createdAt: Date.now(),
      comments: [],
      myVote: null,
    };

    setFeedbackPosts((previous) => [post, ...previous]);
    return true;
  }, []);

  const voteFeedbackPost = useCallback((postId: string, direction: "up" | "down") => {
    setFeedbackPosts((previous) =>
      previous.map((post) => {
        if (post.id !== postId) return post;

        let nextScore = post.score;
        let nextVote: "up" | "down" | null = direction;

        if (post.myVote === direction) {
          nextVote = null;
          nextScore += direction === "up" ? -1 : 1;
        } else {
          if (post.myVote === "up") nextScore -= 1;
          if (post.myVote === "down") nextScore += 1;
          nextScore += direction === "up" ? 1 : -1;
        }

        return {
          ...post,
          score: nextScore,
          myVote: nextVote,
        };
      }),
    );
  }, []);

  const addFeedbackComment = useCallback((postId: string, body: string) => {
    const trimmed = body.trim();
    if (!trimmed) return false;

    setFeedbackPosts((previous) =>
      previous.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...post.comments, { id: createId("comment"), body: trimmed, createdAt: Date.now() }],
            }
          : post,
      ),
    );

    return true;
  }, []);

  const value = useMemo<AppStateContextValue>(
    () => ({
      chats,
      canvasCreations,
      feedbackPosts,
      settings,
      chatSendingById,
      createChat,
      updateChat,
      getChat,
      getRecentChats,
      sendMessage,
      importChatFromUrl,
      setPlanTier,
      setSpeechLanguage,
      setDefaultModel,
      addCanvasCreation,
      toggleCanvasLike,
      toggleCanvasPublish,
      createFeedbackPost,
      voteFeedbackPost,
      addFeedbackComment,
    }),
    [
      addCanvasCreation,
      addFeedbackComment,
      canvasCreations,
      chatSendingById,
      chats,
      createChat,
      createFeedbackPost,
      feedbackPosts,
      getChat,
      getRecentChats,
      importChatFromUrl,
      sendMessage,
      setDefaultModel,
      setPlanTier,
      setSpeechLanguage,
      settings,
      toggleCanvasLike,
      toggleCanvasPublish,
      updateChat,
      voteFeedbackPost,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }

  return context;
}
