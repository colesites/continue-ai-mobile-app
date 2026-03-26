import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Card } from "@/components/ui/card";
import type { FeedbackPost } from "@/features/feedback/types";

type FeedbackPostCardProps = {
  post: FeedbackPost;
  onVote: (postId: string, direction: "up" | "down") => void;
  onOpenDetail: () => void;
};

export function FeedbackPostCard({ post, onVote, onOpenDetail }: FeedbackPostCardProps) {
  return (
    <Card className="gap-2 rounded-2xl bg-[#0d1322]/80">
      <View className="flex-row items-start justify-between gap-2">
        <View className="max-w-[80%] gap-1">
          <Text className="text-sm font-semibold text-slate-50">{post.title}</Text>
          <Text className="text-xs uppercase tracking-[1px] text-slate-400">{post.type}</Text>
        </View>
        <Text className="text-sm font-semibold text-fuchsia-300">{post.score}</Text>
      </View>

      <Text className="text-sm text-slate-300" numberOfLines={3}>
        {post.details}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row gap-2">
          <Pressable className="rounded-lg border border-slate-700 px-3 py-2" onPress={() => onVote(post.id, "up")}>
            <Feather name="arrow-up" size={14} color="#f8fafc" />
          </Pressable>
          <Pressable className="rounded-lg border border-slate-700 px-3 py-2" onPress={() => onVote(post.id, "down")}>
            <Feather name="arrow-down" size={14} color="#f8fafc" />
          </Pressable>
        </View>

        <Pressable onPress={onOpenDetail}>
          <Text className="text-xs font-semibold text-fuchsia-300">Open thread</Text>
        </Pressable>
      </View>
    </Card>
  );
}
