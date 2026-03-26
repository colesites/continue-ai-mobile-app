import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
    Platform,
    Pressable,
    TextInput,
    useColorScheme,
    View
} from "react-native";

interface PromptInputProps {
  value: string;
  onChangeValue: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export const PromptInput = ({
  value,
  onChangeValue,
  onSend,
  disabled,
  placeholder = "Ask me anything...",
}: PromptInputProps) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleSend = () => {
    if (value.trim() && !disabled) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSend();
    }
  };

  return (
    <View
      className="flex-row items-end gap-2 px-4 py-2 bg-background border-t border-border"
      style={{ paddingBottom: Platform.OS === "ios" ? 24 : 12 }}
    >
      <View className="flex-1 flex-row items-end bg-muted rounded-3xl px-4 py-2 border border-border/50">
        <TextInput
          className="flex-1 text-base text-foreground max-h-32"
          multiline
          placeholder={placeholder}
          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
          value={value}
          onChangeText={onChangeValue}
          editable={!disabled}
          style={{ paddingVertical: 8 }}
        />

        {value.length > 0 && (
          <Pressable
            onPress={handleSend}
            disabled={disabled}
            className={`p-2 rounded-full ${isDark ? "bg-primary" : "bg-primary"} ml-2 mb-0.5`}
          >
            <Feather name="arrow-up" size={20} color="white" />
          </Pressable>
        )}
      </View>

      {!value.length && (
        <View className="flex-row gap-1 mb-1">
          <Pressable
            className="p-2 rounded-full bg-muted border border-border/50"
            onPress={() =>
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          >
            <Feather
              name="mic"
              size={20}
              color={isDark ? "#9ca3af" : "#4b5563"}
            />
          </Pressable>
          <Pressable
            className="p-2 rounded-full bg-muted border border-border/50"
            onPress={() =>
              void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
            }
          >
            <Feather
              name="plus"
              size={20}
              color={isDark ? "#9ca3af" : "#4b5563"}
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};
