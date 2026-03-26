import { MainHeader } from "@/components/nav/MainHeader";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenBackground } from "@/components/ui/screen";
import { ChatList } from "@/features/chat/components/chat-list";
import { PromptInput } from "@/features/chat/components/prompt-input";
import { useChatScreen } from "@/features/chat/use-chat-screen";

export default function ChatScreen() {
  const router = useRouter();
  const { chat, messages, isSending, onSend, draft, setDraft } = useChatScreen();

  if (!chat) {
    return (
      <ScreenBackground>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-base text-slate-200">
            Chat not found.
          </Text>
          <Pressable
            className="mt-4 rounded-xl border border-slate-700 px-4 py-2"
            onPress={() => router.replace("/")}
          >
            <Text className="text-sm text-slate-100">Back home</Text>
          </Pressable>
        </View>
      </ScreenBackground>
    );
  }

  // Map AI SDK messages to ChatMessage format if needed (mainly for createdAt)
  const formattedMessages = messages.map((m) => ({
    ...m,
    createdAt: m.createdAt ? m.createdAt.getTime() : Date.now(),
    role: m.role as any,
  }));

  return (
    <ScreenBackground>
      <MainHeader />
      <View className="px-6 pb-2 pt-16">
        <Text className="text-xl font-bold text-foreground" numberOfLines={1}>
          {chat.title}
        </Text>
      </View>

      <View className="flex-1">
        <ChatList messages={formattedMessages} isStreaming={isSending} />
      </View>

      <PromptInput
        value={draft}
        onChangeValue={setDraft}
        onSend={() => void onSend()}
        disabled={isSending}
        placeholder="Continue the conversation..."
      />
    </ScreenBackground>
  );
}
