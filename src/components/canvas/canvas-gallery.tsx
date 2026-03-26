import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { CanvasCreation } from "@/features/canvas/types";
import { Card } from "@/components/ui/card";

type CanvasGalleryProps = {
  creations: CanvasCreation[];
  onLike: (creationId: string) => void;
  onPublish: (creationId: string) => void;
  showPublish: boolean;
};

export function CanvasGallery({ creations, onLike, onPublish, showPublish }: CanvasGalleryProps) {
  if (!creations.length) {
    return (
      <View className="gap-4">
        {/* Empty-state placeholders (match the “sparkles card” look) */}
        <View className="h-56 rounded-3xl border-2 border-dashed border-slate-200/60 bg-white/90 items-center justify-center">
          <Feather name="star" size={28} color="#c4b5fd" />
        </View>
        <View className="h-56 rounded-3xl border-2 border-dashed border-slate-200/60 bg-white/90 items-center justify-center">
          <Feather name="star" size={28} color="#c4b5fd" />
        </View>
      </View>
    );
  }

  return (
    <View className="gap-3">
      {creations.map((creation) => (
        <Card key={creation.id} className="gap-3 rounded-3xl border-slate-200/50 bg-white/95 p-4">
          <View className="h-56 rounded-3xl border-2 border-dashed border-slate-200/60 bg-white/70 items-center justify-center">
            <Feather name={creation.mediaType === "video" ? "play" : "image"} size={26} color="#c4b5fd" />
          </View>

          <View className="gap-1">
            <Text className="text-sm font-semibold text-slate-900" numberOfLines={2}>
              {creation.prompt}
            </Text>
            <Text className="text-xs text-slate-500">
              {creation.mediaType.toUpperCase()} • {creation.modelId} • {creation.aspectRatio}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Pressable
              className="flex-row items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-2"
              onPress={() => onLike(creation.id)}
            >
              <Feather name="heart" size={14} color="#db2777" />
              <Text className="text-xs font-semibold text-slate-700">{creation.likes}</Text>
            </Pressable>

            {showPublish ? (
              <Pressable
                className="flex-row items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-3 py-2"
                onPress={() => onPublish(creation.id)}
              >
                <Feather name={creation.published ? "eye-off" : "globe"} size={14} color="#334155" />
                <Text className="text-xs font-semibold text-slate-700">{creation.published ? "Unpublish" : "Publish"}</Text>
              </Pressable>
            ) : null}
          </View>
        </Card>
      ))}
    </View>
  );
}
