import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import {
  THEMES,
  getThemeLabel,
  getThemePrimaryColor,
  type AppMode,
} from "@/lib/theme";
import { useThemePalette } from "@/providers/ThemeProvider";

type ThemeSelectorSheetProps = {
  open: boolean;
  onClose: () => void;
};

export function ThemeSelectorSheet({ open, onClose }: ThemeSelectorSheetProps) {
  const { theme, setTheme, mode, setMode, palette } = useThemePalette();
  const iconColor = `rgb(${palette.foreground})`;
  const mutedIconColor = `rgb(${palette.mutedForeground})`;

  const modes: {
    id: AppMode;
    label: string;
    icon: keyof typeof Feather.glyphMap;
  }[] = [
    { id: "light", label: "Light", icon: "sun" },
    { id: "dark", label: "Dark", icon: "moon" },
    { id: "system", label: "System", icon: "monitor" },
  ];

  return (
    <Modal
      animationType="slide"
      transparent
      visible={open}
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />
      <View className="bg-card rounded-t-[32px] p-6 pb-12 border-t border-border/40">
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-xl font-bold text-foreground">Theme</Text>
          <Pressable onPress={onClose} className="p-2">
            <Feather name="x" size={24} color={iconColor} />
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Mode Selection */}
          <View className="mb-8">
            <View className="mb-4">
              <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Mode
              </Text>
            </View>
            <View className="gap-2">
              {modes.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => setMode(item.id)}
                  className="flex-row items-center justify-between py-3 px-1"
                >
                  <View className="flex-row items-center gap-3">
                    <Text
                      className={`text-base ${mode === item.id ? "font-bold text-foreground" : "text-muted-foreground"}`}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {mode === item.id && (
                    <Feather name="check" size={20} color={iconColor} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>

          <View className="h-[1px] bg-border/40 mb-8" />

          {/* Color Theme Selection */}
          <View>
            <View className="mb-4">
              <Text className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Color Theme
              </Text>
            </View>
            <View className="gap-2">
              {THEMES.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTheme(t)}
                  className="flex-row items-center justify-between py-3 px-1"
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: getThemePrimaryColor(t) }}
                    />
                    <Text
                      className={`text-base ${theme === t ? "font-bold text-foreground" : "text-muted-foreground"}`}
                    >
                      {getThemeLabel(t)}
                    </Text>
                  </View>
                  {theme === t && (
                    <Feather name="check" size={20} color={iconColor} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
