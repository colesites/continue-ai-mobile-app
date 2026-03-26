import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { useThemePalette } from "@/providers/ThemeProvider";

type InfoModalProps = {
  open: boolean;
  onClose: () => void;
};

export function InfoModal({ open, onClose }: InfoModalProps) {
  const { palette } = useThemePalette();
  const iconColor = `rgb(${palette.foreground})`;
  const mutedIconColor = `rgb(${palette.mutedForeground})`;

  return (
    <Modal
      animationType="fade"
      transparent
      visible={open}
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-center items-center px-6"
        onPress={onClose}
      >
        <Pressable className="bg-card w-full rounded-[24px] overflow-hidden">
          <View className="p-6">
            <View className="flex-row items-center justify-between mb-8">
              <Text className="text-2xl font-bold text-foreground">
                How it works
              </Text>
              <Pressable onPress={onClose} className="p-1">
                <Feather name="x" size={24} color={iconColor} />
              </Pressable>
            </View>

            <View className="gap-8">
              {/* Continue Section */}
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-secondary/30 rounded-2xl items-center justify-center border border-border/40">
                  <Feather name="zap" size={24} color={iconColor} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground mb-1">
                    Continue
                  </Text>
                  <Text className="text-base text-muted-foreground leading-5">
                    Choose GPT / Claude / Gemini and keep going.
                  </Text>
                </View>
              </View>

              {/* Paste Link Section */}
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-secondary/30 rounded-2xl items-center justify-center border border-border/40">
                  <Feather name="link" size={24} color={iconColor} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-bold text-foreground mb-1">
                    Paste a shared link
                  </Text>
                  <Text className="text-base text-muted-foreground leading-5">
                    We'll automatically scrape the conversation from ChatGPT,
                    Claude, or Gemini.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
