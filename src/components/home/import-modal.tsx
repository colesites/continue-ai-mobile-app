import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { useThemePalette } from "@/providers/ThemeProvider";
import { PROVIDER_CONFIG, type Provider } from "@/utils/url-safety";

type ImportModalProps = {
  open: boolean;
  value: string;
  onChangeValue: (value: string) => void;
  onClose: () => void;
  onImport: () => void;
  isImporting: boolean;
  detectedProvider: Provider;
};

export function ImportModal({
  open,
  value,
  onChangeValue,
  onClose,
  onImport,
  isImporting,
  detectedProvider,
}: ImportModalProps) {
  const { palette } = useThemePalette();
  const iconColor = `rgb(${palette.foreground})`;
  const mutedIconColor = `rgb(${palette.mutedForeground})`;

  const provider = PROVIDER_CONFIG[detectedProvider];

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
                Import conversation
              </Text>
              <Pressable onPress={onClose} className="p-1">
                <Feather name="x" size={24} color={iconColor} />
              </Pressable>
            </View>

            <Text className="text-base text-muted-foreground mb-6 leading-5">
              Paste a shared link and continue the conversation in Kontinue AI.
            </Text>

            <View className="flex-row items-center bg-secondary/30 rounded-2xl px-4 py-3 border border-border/40 mb-6">
              <Feather name="link" size={20} color={mutedIconColor} />
              <TextInput
                className="flex-1 text-base text-foreground ml-3"
                placeholder="https://..."
                placeholderTextColor={mutedIconColor}
                value={value}
                onChangeText={onChangeValue}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>

            <View className="flex-row items-center justify-between mb-8">
              <Text className="text-sm font-semibold text-muted-foreground">
                Detected provider
              </Text>
              <View className="flex-row items-center bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40">
                <View
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: provider.color }}
                />
                <Text className="text-sm font-bold text-foreground">
                  {provider.name}
                </Text>
              </View>
            </View>

            <View className="gap-3">
              <Pressable
                onPress={onImport}
                disabled={!value.trim() || isImporting}
                className={`w-full h-14 rounded-2xl items-center justify-center bg-primary ${
                  !value.trim() || isImporting ? "bg-primary/50" : "bg-primary"
                }`}
              >
                {isImporting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-lg font-bold text-white">
                    Import chat
                  </Text>
                )}
              </Pressable>

              <Pressable
                onPress={onClose}
                className="w-full h-14 rounded-2xl items-center justify-center border border-border/40"
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
