import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { ModelSelectorSheet } from "@/components/chat/model-selector-sheet";
import { Card } from "@/components/ui/card";
import { getModelById } from "@/lib/models";
import { useThemePalette } from "@/providers/ThemeProvider";

type ChatComposerProps = {
  value: string;
  onChangeValue: (value: string) => void;
  onSend: () => void;
  isSending?: boolean;
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  placeholder?: string;
};

export function ChatComposer({
  value,
  onChangeValue,
  onSend,
  isSending,
  selectedModel,
  onModelChange,
  placeholder,
}: ChatComposerProps) {
  const [selectorOpen, setSelectorOpen] = useState(false);
  const selectedModelName = getModelById(selectedModel)?.name ?? selectedModel;
  const { palette } = useThemePalette();
  const iconColorPrimary = `rgb(${palette.foreground})`;
  const iconColorMuted = `rgb(${palette.mutedForeground})`;

  return (
    <Card className="p-4 rounded-[32px] border-border/40 bg-card shadow-2xl">
      <TextInput
        multiline
        value={value}
        onChangeText={onChangeValue}
        placeholder={placeholder ?? "Ask anything..."}
        placeholderTextColor="#9ca3af"
        className="min-h-[48px] max-h-32 text-lg text-foreground px-2 py-1 mb-2"
        textAlignVertical="top"
      />

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Pressable
            className="flex-row items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40"
            onPress={() => setSelectorOpen(true)}
          >
            <Feather name="zap" size={14} color={iconColorPrimary} />
            <Text className="text-sm font-bold text-foreground">
              {selectedModelName}
            </Text>
          </Pressable>

          <Pressable className="p-2">
            <Feather name="paperclip" size={20} color={iconColorMuted} />
          </Pressable>
        </View>

        <View className="flex-row items-center gap-2">
          <Pressable className="p-2">
            <Feather name="mic" size={20} color={iconColorMuted} />
          </Pressable>

          <Pressable
            onPress={onSend}
            disabled={!value.trim() || !!isSending}
            className={`w-10 h-10 items-center justify-center rounded-full ${
              value.trim()
                ? "bg-secondary border border-border/50"
                : "bg-muted/30"
            }`}
          >
            <Feather
              name="navigation"
              size={18}
              color={value.trim() ? iconColorPrimary : iconColorMuted}
              style={{ transform: [{ rotate: "1deg" }] }}
            />
          </Pressable>
        </View>
      </View>

      <ModelSelectorSheet
        open={selectorOpen}
        selectedModelId={selectedModel}
        onClose={() => setSelectorOpen(false)}
        onSelect={onModelChange}
      />
    </Card>
  );
}
