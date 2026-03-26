import { Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";

import { ScreenBackground } from "@/components/ui/screen";
import { Card } from "@/components/ui/card";
import { AppButton } from "@/components/ui/app-button";

const TIERS = [
  {
    name: "Free",
    price: "$0",
    highlights: ["Basic chat", "Limited imports", "Free models"],
  },
  {
    name: "Starter",
    price: "$12/mo",
    highlights: ["Higher message limits", "Premium chat models", "Canvas images"],
  },
  {
    name: "Pro",
    price: "$29/mo",
    highlights: ["Highest limits", "Video generation", "Unlimited imports"],
  },
];

export default function PricingScreen() {
  const router = useRouter();

  return (
    <ScreenBackground>
      <ScrollView contentContainerClassName="gap-4 px-4 pb-10 pt-10">
        <Text className="text-center text-xs font-semibold uppercase tracking-[3px] text-fuchsia-300">Pricing</Text>
        <Text className="text-center text-3xl font-semibold text-slate-50">Pick a plan for your workflow</Text>
        <Text className="text-center text-sm text-slate-300">Continue conversations across platforms with the limits you need.</Text>

        <View className="gap-3">
          {TIERS.map((tier) => (
            <Card key={tier.name} className="gap-3 rounded-3xl bg-[#0d1322]/85">
              <View className="flex-row items-baseline justify-between">
                <Text className="text-xl font-semibold text-slate-50">{tier.name}</Text>
                <Text className="text-base text-fuchsia-300">{tier.price}</Text>
              </View>

              <View className="gap-1">
                {tier.highlights.map((item) => (
                  <Text key={item} className="text-sm text-slate-200">• {item}</Text>
                ))}
              </View>
            </Card>
          ))}
        </View>

        <AppButton label="Close" onPress={() => router.back()} />
      </ScrollView>
    </ScreenBackground>
  );
}
