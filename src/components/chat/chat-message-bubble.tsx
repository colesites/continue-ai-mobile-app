import { Text, View } from "react-native";
import type { ChatMessage } from "@/features/chat/types";

type ChatMessageBubbleProps = {
  message: ChatMessage;
};

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <View className={`max-w-[86%] rounded-2xl px-4 py-3 ${isUser ? "self-end bg-fuchsia-500/90" : "self-start bg-slate-900/90 border border-slate-700"}`}>
      <Text className={`text-sm leading-6 ${isUser ? "text-white" : "text-slate-100"}`}>{message.content}</Text>
      <Text className={`mt-2 text-[10px] ${isUser ? "text-fuchsia-100" : "text-slate-400"}`}>
        {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </Text>
    </View>
  );
}
