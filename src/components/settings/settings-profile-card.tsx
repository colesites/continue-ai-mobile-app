import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { planLabel, type PlanTier } from "@/lib/plan-tier";

type SettingsProfileCardProps = {
  displayName: string;
  userEmail: string;
  planTier: PlanTier;
};

export function SettingsProfileCard({
  displayName,
  userEmail,
  planTier,
}: SettingsProfileCardProps) {
  const isPaid = planTier !== "free";

  return (
    <Card className="items-center gap-3 rounded-3xl border-border/70 bg-card/70 px-5 py-6">
      <View className="h-28 w-28 items-center justify-center rounded-full bg-[#c83c0f]">
        <Text className="text-5xl font-semibold text-white">
          {displayName.slice(0, 1).toUpperCase()}
        </Text>
      </View>

      <View className="items-center gap-1">
        <Text className="text-2xl font-semibold text-foreground">
          {displayName}
        </Text>
        <Text className="text-sm text-muted-foreground">{userEmail}</Text>
      </View>

      <View
        className={`rounded-md border px-2.5 py-1 ${
          isPaid
            ? "border-primary/40 bg-primary/15"
            : "border-border/70 bg-background/70"
        }`}
      >
        <Text
          className={`text-xs font-semibold ${
            isPaid ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {planLabel(planTier)} Plan
        </Text>
      </View>
    </Card>
  );
}
