import { Text, TextInput, View } from "react-native";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { AppButton } from "@/components/ui/app-button";
import type { FeedbackPostType } from "@/features/feedback/types";

type FeedbackComposerProps = {
  title: string;
  details: string;
  type: FeedbackPostType;
  onTitleChange: (value: string) => void;
  onDetailsChange: (value: string) => void;
  onTypeChange: (value: FeedbackPostType) => void;
  onSubmit: () => void;
};

export function FeedbackComposer({
  title,
  details,
  type,
  onTitleChange,
  onDetailsChange,
  onTypeChange,
  onSubmit,
}: FeedbackComposerProps) {
  return (
    <Card className="gap-3 rounded-3xl bg-[#0d1322]/90">
      <Text className="text-base font-semibold text-slate-50">Post feedback</Text>

      <View className="flex-row gap-2">
        <Chip label="Feature" selected={type === "feature"} onPress={() => onTypeChange("feature")} />
        <Chip label="Bug" selected={type === "bug"} onPress={() => onTypeChange("bug")} />
      </View>

      <TextInput
        value={title}
        onChangeText={onTitleChange}
        placeholder="Short title"
        placeholderTextColor="#7a86a5"
        className="rounded-xl border border-slate-700 bg-[#0a101d] px-4 py-3 text-sm text-slate-100"
      />

      <TextInput
        value={details}
        onChangeText={onDetailsChange}
        multiline
        placeholder="Describe the idea or bug"
        placeholderTextColor="#7a86a5"
        className="min-h-[96px] rounded-xl border border-slate-700 bg-[#0a101d] px-4 py-3 text-sm text-slate-100"
      />

      <AppButton label="Publish" onPress={onSubmit} />
    </Card>
  );
}
