import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { ChatThread } from "@/features/chat/types";
import { Card } from "@/components/ui/card";

type RecentChatListProps = {
  chats: ChatThread[];
  onOpenChat: (chatId: string) => void;
};

export function RecentChatList({ chats, onOpenChat }: RecentChatListProps) {
  return (
    <Card className="gap-3 rounded-3xl bg-[#0d1322]/80">
      <Text className="text-base font-semibold text-slate-50">Recent chats</Text>

      {chats.length === 0 ? (
        <Text className="text-sm text-slate-300">No chats yet. Send your first prompt to start.</Text>
      ) : (
        <View className="gap-2">
          {chats.slice(0, 5).map((chat) => (
            <Pressable
              key={chat.id}
              onPress={() => onOpenChat(chat.id)}
              className="flex-row items-center justify-between rounded-xl border border-slate-700 bg-[#0a101d] px-3 py-3"
            >
              <View className="max-w-[85%] gap-1">
                <Text className="text-sm font-semibold text-slate-100" numberOfLines={1}>
                  {chat.title}
                </Text>
                <Text className="text-xs text-slate-400" numberOfLines={1}>
                  {chat.messages.length} messages
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color="#cbd5e1" />
            </Pressable>
          ))}
        </View>
      )}
    </Card>
  );
}
