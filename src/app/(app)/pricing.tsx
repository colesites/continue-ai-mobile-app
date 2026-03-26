import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";

import { ScreenBackground } from "@/components/ui/screen";
import { Card } from "@/components/ui/card";
import { AppButton } from "@/components/ui/app-button";
import { initiateInterswitchPayment } from "@/lib/interswitch";
import { useAppState } from "@/contexts/app-state-context";

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    highlights: ["Basic chat", "Limited imports", "Free models"],
  },
  {
    id: "starter",
    name: "Starter",
    price: "$12/mo",
    amountKobo: 120000, // $12 converted to Kobo (e.g. 1200.00 for N1200.00 if NGN)
    payItemId: "101", // Example Pay Item ID
    highlights: ["Higher message limits", "Premium chat models", "Canvas images"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29/mo",
    amountKobo: 290000, // $29 converted to Kobo
    payItemId: "102", // Example Pay Item ID
    highlights: ["Highest limits", "Video generation", "Unlimited imports"],
  },
];

export default function PricingScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { setPlanTier } = useAppState();

  const handleSubscribe = async (tier: (typeof TIERS)[0]) => {
    if (tier.id === "free") {
      setPlanTier("free");
      router.back();
      return;
    }

    if (!user) {
      Alert.alert("Sign in required", "Please sign in to upgrade your plan.");
      return;
    }

    try {
      const result = await initiateInterswitchPayment({
        amount: tier.amountKobo || 0,
        customerId: user.id,
        customerName: user.fullName || "User",
        customerEmail: user.primaryEmailAddress?.emailAddress || "",
        payItemId: tier.payItemId || "",
      });

      if (result.success) {
        // In a real app, you would verify with your backend here
        // For this demo, we'll just update the local state
        setPlanTier(tier.id as any);
        Alert.alert("Success", `You are now subscribed to ${tier.name} plan!`);
        router.back();
      } else {
        Alert.alert("Payment Canceled", "Your payment was not completed.");
      }
    } catch (error) {
      Alert.alert("Payment Error", "Something went wrong during the payment process.");
    }
  };

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

              <AppButton
                label={tier.id === "free" ? "Get Started" : `Subscribe to ${tier.name}`}
                onPress={() => handleSubscribe(tier)}
                variant={tier.id === "pro" ? "primary" : "secondary"}
              />
            </Card>
          ))}
        </View>

        <AppButton label="Close" onPress={() => router.back()} variant="ghost" />
      </ScrollView>
    </ScreenBackground>
  );
}
