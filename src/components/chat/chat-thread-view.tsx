import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import type { ChatThread } from "@/features/chat/types";
import { ChatMessageBubble } from "@/components/chat/chat-message-bubble";

type ChatThreadViewProps = {
  chat: ChatThread;
  isSending: boolean;
};

export function ChatThreadView({ chat, isSending }: ChatThreadViewProps) {
  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="gap-3 px-4 pb-6 pt-3"
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      <View className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2">
        <Text className="text-xs text-slate-300">{chat.provider.toUpperCase()} • {chat.importMethod === "automatic" ? "Imported" : "Manual"}</Text>
        {chat.sourceUrl ? <Text className="mt-1 text-xs text-slate-400">{chat.sourceUrl}</Text> : null}
      </View>

      {chat.messages.map((message) => (
        <ChatMessageBubble key={message.id} message={message} />
      ))}

      {isSending ? (
        <View className="self-start rounded-2xl border border-slate-700 bg-slate-900/85 px-4 py-3">
          <View className="flex-row items-center gap-2">
            <ActivityIndicator size="small" color="#f472b6" />
            <Text className="text-sm text-slate-300">Thinking...</Text>
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}
