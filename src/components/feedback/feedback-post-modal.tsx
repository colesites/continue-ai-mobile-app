import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { AppButton } from "@/components/ui/app-button";
import type { FeedbackPost } from "@/features/feedback/types";

type FeedbackPostModalProps = {
  post: FeedbackPost | null;
  open: boolean;
  onClose: () => void;
  onVote: (postId: string, direction: "up" | "down") => void;
  onComment: (postId: string, body: string) => boolean;
};

export function FeedbackPostModal({ post, open, onClose, onVote, onComment }: FeedbackPostModalProps) {
  const [draftComment, setDraftComment] = useState("");

  if (!post) return null;

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="max-h-[84%] rounded-t-3xl border border-slate-700 bg-[#090d17] p-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="max-w-[80%] text-base font-semibold text-slate-50">{post.title}</Text>
            <Pressable onPress={onClose}>
              <Text className="text-sm font-semibold text-fuchsia-300">Close</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerClassName="gap-3 pb-4" showsVerticalScrollIndicator={false}>
            <Text className="text-sm text-slate-300">{post.details}</Text>

            <View className="flex-row gap-2">
              <Pressable className="rounded-lg border border-slate-700 px-3 py-2" onPress={() => onVote(post.id, "up")}>
                <Text className="text-xs text-slate-100">Upvote</Text>
              </Pressable>
              <Pressable className="rounded-lg border border-slate-700 px-3 py-2" onPress={() => onVote(post.id, "down")}>
                <Text className="text-xs text-slate-100">Downvote</Text>
              </Pressable>
            </View>

            <View className="gap-2">
              <Text className="text-xs uppercase tracking-[1px] text-slate-400">Comments</Text>
              {post.comments.length === 0 ? (
                <Text className="text-sm text-slate-400">No comments yet.</Text>
              ) : (
                post.comments.map((comment) => (
                  <View key={comment.id} className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2">
                    <Text className="text-sm text-slate-200">{comment.body}</Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>

          <View className="gap-2 border-t border-slate-700 pt-3">
            <TextInput
              value={draftComment}
              onChangeText={setDraftComment}
              placeholder="Add a comment"
              placeholderTextColor="#7a86a5"
              className="rounded-xl border border-slate-700 bg-[#0a101d] px-4 py-3 text-sm text-slate-100"
            />
            <AppButton
              label="Comment"
              onPress={() => {
                if (onComment(post.id, draftComment)) {
                  setDraftComment("");
                }
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
