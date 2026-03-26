import { Pressable, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ScreenBackground } from "@/components/ui/screen";
import { Card } from "@/components/ui/card";

export default function ShareChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ chatId?: string }>();
  const chatId = params.chatId ?? "";

  return (
    <ScreenBackground>
      <View className="flex-1 justify-center px-4">
        <Card className="gap-3 rounded-3xl bg-[#0d1322]/90">
          <Text className="text-lg font-semibold text-slate-50">Share Chat</Text>
          <Text className="text-sm text-slate-300">
            Chat sharing endpoint can be connected from your backend. Chat ID: {chatId}
          </Text>
          <Text className="text-xs text-slate-400">
            You can wire this to an API route that creates public links similar to the web app.
          </Text>

          <Pressable className="rounded-xl border border-slate-700 px-4 py-3" onPress={() => router.back()}>
            <Text className="text-sm font-semibold text-slate-100">Close</Text>
          </Pressable>
        </Card>
      </View>
    </ScreenBackground>
  );
}
