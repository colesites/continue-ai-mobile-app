import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

import type { SpeechLanguageOption } from "@/lib/speech-settings";
import { useThemePalette } from "@/providers/ThemeProvider";

type SettingsLanguageDropdownProps = {
  value: string;
  options: SpeechLanguageOption[];
  onChange: (value: string) => void;
};

function formatOptionLabel(option: SpeechLanguageOption): string {
  return option.nativeLabel ? `${option.label} - ${option.nativeLabel}` : option.label;
}

export function SettingsLanguageDropdown({
  value,
  options,
  onChange,
}: SettingsLanguageDropdownProps) {
  const [open, setOpen] = useState(false);
  const { palette } = useThemePalette();
  const iconColor = `rgb(${palette.foreground})`;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? options[0],
    [options, value],
  );

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
        className="h-12 flex-row items-center justify-between rounded-xl border border-border/70 bg-background/80 px-3"
      >
        <Text className="flex-1 pr-3 text-sm text-foreground" numberOfLines={1}>
          {selectedOption ? formatOptionLabel(selectedOption) : "Select language"}
        </Text>
        <Feather name="chevron-down" size={16} color={iconColor} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable className="flex-1 bg-black/35" onPress={() => setOpen(false)} />

        <View className="max-h-[78%] rounded-t-3xl border-t border-border bg-card px-4 pb-6 pt-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-base font-semibold text-foreground">Preferred Voice Language</Text>
            <Pressable onPress={() => setOpen(false)} className="p-1.5">
              <Feather name="x" size={18} color={iconColor} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="gap-1 pb-2">
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`rounded-xl border px-3 py-2.5 ${
                      isSelected
                        ? "border-primary/50 bg-primary/10"
                        : "border-border/60 bg-background/70"
                    }`}
                  >
                    <View className="flex-row items-center justify-between gap-2">
                      <Text
                        className={`flex-1 text-sm ${isSelected ? "font-semibold text-foreground" : "text-foreground"}`}
                        numberOfLines={2}
                      >
                        {formatOptionLabel(option)}
                      </Text>
                      {isSelected ? (
                        <Feather name="check" size={15} color={iconColor} />
                      ) : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}
