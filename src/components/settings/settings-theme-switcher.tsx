import { Text, View } from "react-native";

import { Chip } from "@/components/ui/chip";
import { THEMES, getThemeLabel, type Theme } from "@/lib/theme";

type SettingsThemeSwitcherProps = {
  value: Theme;
  onChange: (theme: Theme) => void;
};

export function SettingsThemeSwitcher({ value, onChange }: SettingsThemeSwitcherProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-foreground">Color theme</Text>
      <View className="flex-row flex-wrap gap-2">
        {THEMES.map((theme) => (
          <Chip
            key={theme}
            label={getThemeLabel(theme)}
            selected={value === theme}
            onPress={() => onChange(theme)}
          />
        ))}
      </View>
    </View>
  );
}
