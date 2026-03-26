import { Feather } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from "react-native";

import { useThemePalette } from "@/providers/ThemeProvider";

type ChatRenameModalProps = {
  open: boolean;
  value: string;
  onChangeValue: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
  isSaving: boolean;
};

export function ChatRenameModal({
  open,
  value,
  onChangeValue,
  onClose,
  onSave,
  isSaving,
}: ChatRenameModalProps) {
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
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-2xl font-bold text-foreground">
                Rename chat
              </Text>
              <Pressable onPress={onClose} className="p-1">
                <Feather name="x" size={24} color={iconColor} />
              </Pressable>
            </View>

            <View className="flex-row items-center bg-secondary/30 rounded-2xl px-4 py-3 border border-border/40 mb-6">
              <Feather name="edit-2" size={20} color={mutedIconColor} />
              <TextInput
                className="flex-1 text-base text-foreground ml-3"
                placeholder="Chat title"
                placeholderTextColor={mutedIconColor}
                value={value}
                onChangeText={onChangeValue}
                autoCapitalize="sentences"
                autoCorrect
              />
            </View>

            <View className="gap-3">
              <Pressable
                onPress={onSave}
                disabled={!value.trim() || isSaving}
                className={`w-full h-14 rounded-2xl items-center justify-center bg-primary ${
                  !value.trim() || isSaving ? "bg-primary/50" : "bg-primary"
                }`}
              >
                {isSaving ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-bold text-white">Save</Text>
                )}
              </Pressable>

              <Pressable
                onPress={onClose}
                disabled={isSaving}
                className={`w-full h-14 rounded-2xl items-center justify-center border border-border/40 ${
                  isSaving ? "opacity-60" : ""
                }`}
              >
                <Text className="text-lg font-bold text-foreground">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

