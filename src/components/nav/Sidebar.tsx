import { useAuth, useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useMutation, useQuery } from "convex/react";
import { usePathname, useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChatActionsMenuModal, type ChatActionsAnchorRect } from "@/components/nav/chat-actions-menu-modal";
import { ChatRenameModal } from "@/components/nav/chat-rename-modal";
import { useThemePalette } from "@/providers/ThemeProvider";
import { getModelById, getProviderColor, type ModelOption } from "@/lib/models";
import { PROVIDER_CONFIG, type Provider } from "@/utils/url-safety";
import { api } from "../../../convex/_generated/api";

const MODEL_PROVIDERS = new Set<ModelOption["provider"]>([
  "openai",
  "anthropic",
  "google",
  "deepseek",
  "minimax",
  "mistral",
  "perplexity",
  "zai",
  "alibaba",
]);

function getShareProviderKey(value: unknown): Provider | null {
  if (typeof value !== "string") return null;
  const normalized = value.toLowerCase();
  return normalized in PROVIDER_CONFIG ? (normalized as Provider) : null;
}

function getModelProviderKey(value: unknown): ModelOption["provider"] | null {
  if (typeof value !== "string") return null;
  const normalized = value.toLowerCase();
  return MODEL_PROVIDERS.has(normalized as ModelOption["provider"])
    ? (normalized as ModelOption["provider"])
    : null;
}

function getChatIconColor(chat: unknown): string | null {
  if (!chat || typeof chat !== "object") return null;

  const record = chat as Record<string, unknown>;

  const source = record.source;
  if (source && typeof source === "object") {
    const sourceRecord = source as Record<string, unknown>;
    const sourceShareProvider = getShareProviderKey(sourceRecord.provider);
    if (sourceShareProvider) return PROVIDER_CONFIG[sourceShareProvider].color;

    const sourceModelProvider = getModelProviderKey(sourceRecord.provider);
    if (sourceModelProvider) return getProviderColor(sourceModelProvider);
  }

  const shareProvider = getShareProviderKey(record.provider);
  if (shareProvider) return PROVIDER_CONFIG[shareProvider].color;

  const modelProvider = getModelProviderKey(record.provider);
  if (modelProvider) return getProviderColor(modelProvider);

  const modelId =
    typeof record.modelId === "string"
      ? record.modelId
      : typeof record.model === "string"
        ? record.model
        : typeof record.defaultModelId === "string"
          ? record.defaultModelId
          : null;

  if (!modelId) return null;

  const resolvedProvider = getModelById(modelId)?.provider;
  if (resolvedProvider) return getProviderColor(resolvedProvider);

  const providerFromId = modelId.split("/")[0];
  const providerKey = getModelProviderKey(providerFromId);
  if (providerKey) return getProviderColor(providerKey);

  return null;
}

export const Sidebar = (props: DrawerContentComponentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useAuth();
  const { palette, scheme } = useThemePalette();
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [actionsChat, setActionsChat] = useState<any | null>(null);
  const [actionsAnchor, setActionsAnchor] = useState<ChatActionsAnchorRect | null>(null);
  const [renameChat, setRenameChat] = useState<any | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [busyChatId, setBusyChatId] = useState<string | null>(null);
  const actionButtonRefs = useRef<Record<string, any>>({});

  const sidebarForeground = `rgb(${palette.sidebarForeground})`;
  const sidebarAccentForeground = `rgb(${palette.sidebarAccentForeground})`;
  const primaryColor = `rgb(${palette.primary})`;
  const destructiveColor = `rgb(${palette.destructive})`;

  // Fetch chats from Convex
  const allChats = useQuery(api.chats.getUserChats, {}) ?? [];

  const toggleChatPin = useMutation(api.chats.toggleChatPin);
  const updateChatTitle = useMutation(api.chats.updateChatTitle);
  const deleteChat = useMutation(api.chats.deleteChat);

  const isChatPinned = (chat: any) => typeof chat?.pinnedAt === "number" && chat.pinnedAt > 0;

  const handleTogglePin = async (chat: any) => {
    if (!chat?._id || busyChatId) return;
    const nextPinned = !isChatPinned(chat);
    setBusyChatId(chat._id);
    try {
      await toggleChatPin({ chatId: chat._id, pinned: nextPinned });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not update pin status.";
      Alert.alert("Pin failed", message);
    } finally {
      setBusyChatId(null);
    }
  };

  const openRename = (chat: any) => {
    setRenameChat(chat);
    setRenameValue(typeof chat?.title === "string" ? chat.title : "");
  };

  const handleRenameSave = async () => {
    if (!renameChat?._id || busyChatId) return;
    const nextTitle = renameValue.trim();
    if (!nextTitle) {
      Alert.alert("Title required", "Enter a title to rename this chat.");
      return;
    }

    setBusyChatId(renameChat._id);
    try {
      await updateChatTitle({ chatId: renameChat._id, title: nextTitle });
      setRenameChat(null);
      setRenameValue("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not rename this chat.";
      Alert.alert("Rename failed", message);
    } finally {
      setBusyChatId(null);
    }
  };

  const handleDeleteChat = async (chat: any) => {
    if (!chat?._id || busyChatId) return;
    setBusyChatId(chat._id);
    try {
      await deleteChat({ chatId: chat._id });
      if (pathname === `/chat/${chat._id}`) {
        router.replace("/");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not delete this chat.";
      Alert.alert("Delete failed", message);
    } finally {
      setBusyChatId(null);
    }
  };

  const filteredChats = useMemo(() => {
    if (!searchQuery.trim()) return allChats.slice(0, 20);
    const lower = searchQuery.toLowerCase();
    return allChats
      .filter((c: any) => c.title.toLowerCase().includes(lower))
      .slice(0, 20);
  }, [allChats, searchQuery]);

  const navigateTo = (path: string) => {
    props.navigation.closeDrawer();
    router.push(path as never);
  };

  const onClearSearch = () => setSearchQuery("");
  const closeActionsMenu = () => {
    setActionsChat(null);
    setActionsAnchor(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-sidebar">
      <ChatActionsMenuModal
        open={!!actionsChat}
        anchorRect={actionsAnchor}
        pinned={isChatPinned(actionsChat)}
        busy={!!busyChatId}
        onClose={closeActionsMenu}
        onTogglePin={() => {
          const chat = actionsChat;
          closeActionsMenu();
          if (chat) void handleTogglePin(chat);
        }}
        onRename={() => {
          const chat = actionsChat;
          closeActionsMenu();
          if (chat) openRename(chat);
        }}
        onShare={() => {
          const chat = actionsChat;
          closeActionsMenu();
          if (!chat?._id) return;
          props.navigation.closeDrawer();
          router.push({
            pathname: "/share/[chatId]",
            params: { chatId: chat._id },
          });
        }}
        onDelete={() => {
          const chat = actionsChat;
          closeActionsMenu();
          if (!chat?._id) return;
          Alert.alert(
            "Delete chat?",
            "This will permanently delete this chat and its messages.",
            [
              { text: "Cancel", style: "cancel" },
              { text: "Delete", style: "destructive", onPress: () => void handleDeleteChat(chat) },
            ],
          );
        }}
      />

      <ChatRenameModal
        open={!!renameChat}
        value={renameValue}
        onChangeValue={setRenameValue}
        onClose={() => {
          if (busyChatId) return;
          setRenameChat(null);
        }}
        onSave={() => void handleRenameSave()}
        isSaving={!!renameChat && busyChatId === renameChat._id}
      />

      {/* SidebarHeader */}
      <View className="border-b border-sidebar-border/60 p-4 pb-5">
        <View>
          <View className="flex-row items-center mb-6 px-1">
            <Image
              source={require("../../../assets/images/kontinueai.png")}
              className="w-32 h-9"
              resizeMode="contain"
              style={{ tintColor: scheme === "light" ? "#000000" : "#ffffff" }}
            />
          </View>

          <Pressable
            onPress={() => navigateTo("/")}
            className="flex-row w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary px-4 py-3 shadow mb-3"
          >
            <Feather
              name="plus-square"
              size={18}
              color={`rgb(${palette.primaryForeground})`}
            />
            <Text className="text-sm font-bold text-primary-foreground">
              New Chat
            </Text>
          </Pressable>

          <Pressable
            onPress={() => navigateTo("/canvas")}
            className="flex-row w-full items-center justify-center gap-2 rounded-xl border border-sidebar-border/60 bg-sidebar-accent/30 px-4 py-3 shadow-sm mb-4"
          >
            <Feather
              name="image"
              size={18}
              color={`rgb(${palette.sidebarForeground})`}
            />
            <Text className="text-sm font-bold text-sidebar-foreground">
              Canvas
            </Text>
          </Pressable>

          <View className="relative h-11">
            <View className="absolute left-3 top-1/2 -mt-2 z-10">
              <Feather
                name="search"
                size={16}
                color={sidebarForeground}
                style={{ opacity: 0.6 }}
              />
            </View>
            <TextInput
              id="sidebar-thread-search"
              placeholder="Search your threads..."
              placeholderTextColor="rgba(128,128,128,0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 bg-sidebar-accent/30 pl-10 pr-9 text-sm text-sidebar-foreground rounded-xl h-full"
            />
            {searchQuery && (
              <Pressable
                onPress={onClearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -mt-2"
              >
                <Feather
                  name="x"
                  size={14}
                  color={sidebarForeground}
                  style={{ opacity: 0.4 }}
                />
              </Pressable>
            )}
          </View>
        </View>
      </View>

      {/* Recent Chats Section */}
      <ScrollView className="flex-1 px-3 pt-5">
        <Text className="px-2 text-[11px] font-bold uppercase tracking-[0.3em] text-sidebar-foreground/60 mb-5">
          {searchQuery.trim() ? "Search Results" : "Recent Chats"}
        </Text>

        {filteredChats.length === 0 ? (
          <View className="mt-4 rounded-xl border border-dashed border-sidebar-border/60 px-3 py-4">
            <Text className="text-center text-xs text-sidebar-foreground/60">
              {searchQuery.trim()
                ? `No results found for "${searchQuery}"`
                : "No chats yet. Import a conversation to get started."}
            </Text>
          </View>
        ) : (
          filteredChats.map((chat: any) => {
            const isActive = pathname === `/chat/${chat._id}`;
            const chatIconColor = isActive ? null : getChatIconColor(chat);
            const messageCircleColor = isActive
              ? sidebarAccentForeground
              : chatIconColor ?? sidebarForeground;
            return (
              <View
                key={chat._id}
                className={`flex-row items-center justify-between h-14 px-4 mb-2 rounded-xl border ${
                  isActive
                    ? "border-sidebar-border bg-sidebar-accent/40"
                    : "border-transparent"
                }`}
              >
                <Pressable
                  className="flex-row items-center gap-4 flex-1"
                  onPress={() => {
                    props.navigation.closeDrawer();
                    router.push({
                      pathname: "/chat/[chatId]",
                      params: { chatId: chat._id },
                    });
                  }}
                >
                  <Feather
                    name="message-circle"
                    size={20}
                    color={messageCircleColor}
                    style={isActive || chatIconColor ? undefined : { opacity: 0.6 }}
                  />
                  <Text
                    className={`text-base flex-1 truncate ${
                      isActive
                        ? "text-sidebar-accent-foreground font-semibold"
                        : "text-sidebar-foreground"
                    }`}
                    numberOfLines={1}
                  >
                    {chat.title}
                  </Text>
                </Pressable>
                <Pressable
                  className={`p-1 ${busyChatId === chat._id ? "opacity-40" : ""}`}
                  disabled={busyChatId === chat._id}
                  aria-label={`Open actions for ${chat.title}`}
                  onPress={() => {
                    const chatId = String(chat._id);
                    const node = actionButtonRefs.current[chatId];
                    if (node?.measureInWindow) {
                      node.measureInWindow((x: number, y: number, width: number, height: number) => {
                        setActionsAnchor({ x, y, width, height });
                        setActionsChat(chat);
                      });
                      return;
                    }
                    setActionsAnchor(null);
                    setActionsChat(chat);
                  }}
                  ref={(node) => {
                    const chatId = String(chat._id);
                    if (node) {
                      actionButtonRefs.current[chatId] = node;
                      return;
                    }
                    delete actionButtonRefs.current[chatId];
                  }}
                >
                  <Feather
                    name="more-horizontal"
                    size={20}
                    color={sidebarForeground}
                    style={{ opacity: 0.6 }}
                  />
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* SidebarFooter */}
      <View className="border-t border-sidebar-border/60 p-4">
        <View>
          <Pressable
            onPress={() => navigateTo("/pricing")}
            className="flex-row items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 p-3 mb-3"
          >
            <Feather name="zap" size={14} color={`rgb(${palette.primary})`} />
            <Text className="text-xs font-semibold text-primary">
              Upgrade to Starter
            </Text>
          </Pressable>

          <View className="relative z-[100]">
            {/* Popover User Menu */}
            {isUserMenuOpen && (
              <View className="absolute bottom-16 left-0 right-0 rounded-2xl border border-sidebar-border bg-sidebar shadow-xl overflow-hidden">
                <View className="flex-row items-center gap-3 p-3 border-b border-sidebar-border/60">
                  {user?.imageUrl ? (
                    <Image
                      source={{ uri: user.imageUrl }}
                      className="h-9 w-9 rounded-full border border-sidebar-border/60"
                    />
                  ) : (
                    <View className="flex h-9 w-9 items-center justify-center rounded-full border border-sidebar-border/60 bg-primary/15">
                      <Text className="text-sm font-semibold text-primary">
                        {(user?.firstName?.[0] || "U").toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <View className="flex-1 min-w-0">
                    <Text
                      className="truncate text-xs font-medium text-sidebar-foreground"
                      numberOfLines={1}
                    >
                      {user?.fullName || "Logged in"}
                    </Text>
                    <Text
                      className="truncate text-[10px] text-sidebar-foreground/60"
                      numberOfLines={1}
                    >
                      {user?.primaryEmailAddress?.emailAddress || "Account"}
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={() => {
                    setIsUserMenuOpen(false);
                    navigateTo("/settings");
                  }}
                  className="flex-row items-center gap-2 px-4 py-3 active:bg-sidebar-accent/20"
                >
                  <Feather name="settings" size={16} color={primaryColor} />
                  <Text className="text-sm text-sidebar-foreground">
                    Settings
                  </Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setIsUserMenuOpen(false);
                    navigateTo("/feedback");
                  }}
                  className="flex-row items-center gap-2 px-4 py-3 active:bg-sidebar-accent/20"
                >
                  <Feather
                    name="message-square"
                    size={16}
                    color={primaryColor}
                  />
                  <Text className="text-sm text-sidebar-foreground">
                    Feedback
                  </Text>
                </Pressable>

                <View className="h-px bg-sidebar-border/60" />

                <Pressable
                  onPress={() => signOut()}
                  className="flex-row items-center gap-2 px-4 py-3 active:bg-sidebar-accent/20"
                >
                  <Feather
                    name="log-out"
                    size={16}
                    color={destructiveColor}
                  />
                  <Text className="text-sm text-destructive">Sign Out</Text>
                </Pressable>
              </View>
            )}

            {/* Profile Trigger Button */}
            <Pressable
              onPress={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex-row w-full items-center gap-3 rounded-xl border border-sidebar-border/60 p-2.5 ${
                isUserMenuOpen ? "bg-sidebar-accent/50" : "bg-sidebar-accent/20"
              }`}
            >
              {user?.imageUrl ? (
                <Image
                  source={{ uri: user.imageUrl }}
                  className="h-9 w-9 rounded-full border border-sidebar-border/60 bg-sidebar-accent/50"
                  style={{ backgroundColor: "black" }} // Placeholder color
                />
              ) : (
                <View className="flex h-9 w-9 items-center justify-center rounded-full border border-sidebar-border/60 bg-primary/15">
                  <Text className="text-sm font-semibold text-primary">
                    {(user?.firstName?.[0] || "U").toUpperCase()}
                  </Text>
                </View>
              )}
              <View className="flex-1 min-w-0 text-left">
                <Text className="truncate text-xs font-medium leading-tight text-sidebar-foreground">
                  {user?.fullName || "Logged in"}
                </Text>
                <Text className="truncate text-[10px] leading-tight text-sidebar-foreground/60">
                  {user?.primaryEmailAddress?.emailAddress || "Account"}
                </Text>
              </View>
              <Feather
                name="chevron-up"
                size={16}
                color={sidebarForeground}
                style={{ opacity: 0.6 }}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
