import { Text, View } from "react-native";
import { Chip } from "@/components/ui/chip";
import type { PlanTier } from "@/lib/plan-tier";

type SettingsPlanSwitcherProps = {
  value: PlanTier;
  onChange: (value: PlanTier) => void;
};

export function SettingsPlanSwitcher({ value, onChange }: SettingsPlanSwitcherProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-foreground">Preview plan tier</Text>
      <View className="flex-row gap-2">
        <Chip label="Free" selected={value === "free"} onPress={() => onChange("free")} />
        <Chip label="Starter" selected={value === "starter"} onPress={() => onChange("starter")} />
        <Chip label="Pro" selected={value === "pro"} onPress={() => onChange("pro")} />
      </View>
    </View>
  );
}
