import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useClerk, useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

import { MainHeader } from "@/components/nav/MainHeader";
import { SettingsAccountPanel } from "@/components/settings/settings-account-panel";
import { SettingsContactCards } from "@/components/settings/settings-contact-cards";
import { SettingsProfileCard } from "@/components/settings/settings-profile-card";
import { Card } from "@/components/ui/card";
import { ScreenBackground } from "@/components/ui/screen";
import { useSettingsScreen } from "@/features/settings/use-settings-screen";
import { planLabel } from "@/lib/plan-tier";
import { useThemePalette } from "@/providers/ThemeProvider";

type SettingsTab = "account" | "contact";

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const { signOut } = useClerk();
  const { user } = useUser();
  const { palette } = useThemePalette();
  const {
    settings,
    usage,
    selectedLanguageLabel,
    setSpeechLanguage,
  } = useSettingsScreen();

  const displayName =
    user?.fullName?.trim() || user?.firstName?.trim() || "Kontinue User";
  const userEmail = user?.primaryEmailAddress?.emailAddress || "Signed in user";
  const iconColor = `rgb(${palette.foreground})`;
  const planTierLabel = planLabel(settings.planTier);

  const planDescription =
    settings.planTier === "pro"
      ? "You have access to the highest limits, premium models, and extended token caps."
      : settings.planTier === "starter"
        ? "You have access to premium models and increased limits."
        : "You are on the free plan. Upgrade when you need more limits.";

  return (
    <ScreenBackground>
      <MainHeader />

      <ScrollView
        contentContainerClassName="gap-4 px-4 pb-24 pt-20"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3 py-3"
          >
            <Feather name="arrow-left" size={16} color={iconColor} />
            <Text className="text-sm font-semibold text-foreground">Back to Chat</Text>
          </Pressable>

          <Pressable
            onPress={() => void signOut()}
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/70 px-3 py-3"
          >
            <Feather name="log-out" size={16} color={iconColor} />
            <Text className="text-sm font-semibold text-foreground">Sign out</Text>
          </Pressable>
        </View>

        <SettingsProfileCard
          displayName={displayName}
          userEmail={userEmail}
          planTier={settings.planTier}
        />

        <Card className="gap-2 rounded-2xl border-border/70 bg-card/70">
          <Text className="text-base font-semibold text-foreground">Current plan</Text>
          <Text className="text-sm text-muted-foreground">{planDescription}</Text>
          {settings.planTier !== "pro" ? (
            <Pressable
              onPress={() => router.push("/pricing")}
              className="mt-1 self-start rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5"
            >
              <Text className="text-sm font-semibold text-primary">View pricing</Text>
            </Pressable>
          ) : (
            <View className="mt-1 self-start rounded-lg border border-primary/40 bg-primary/15 px-3 py-1.5">
              <Text className="text-xs font-semibold text-primary">{planTierLabel} Plan Active</Text>
            </View>
          )}
        </Card>

        <Card className="gap-5 rounded-3xl border-border/70 bg-card/70 p-5">
          <View className="self-start rounded-xl border border-border/70 bg-background/60 p-1">
            <View className="flex-row">
              <Pressable
                onPress={() => setActiveTab("account")}
                className={`rounded-lg px-4 py-2 ${
                  activeTab === "account" ? "bg-card shadow-sm" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-base ${
                    activeTab === "account"
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Account
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setActiveTab("contact")}
                className={`rounded-lg px-4 py-2 ${
                  activeTab === "contact" ? "bg-card shadow-sm" : "bg-transparent"
                }`}
              >
                <Text
                  className={`text-base ${
                    activeTab === "contact"
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Contact Us
                </Text>
              </Pressable>
            </View>
          </View>

          {activeTab === "account" ? (
            <SettingsAccountPanel
              selectedLanguage={settings.speechLanguage}
              selectedLanguageLabel={selectedLanguageLabel}
              usage={usage}
              onLanguageChange={setSpeechLanguage}
            />
          ) : (
            <View className="gap-6">
              <View>
                <Text className="text-2xl font-semibold text-foreground">Contact Us</Text>
                <Text className="mt-1 text-sm text-muted-foreground">
                  Legal and policy information.
                </Text>
              </View>

              <SettingsContactCards onOpenFeedback={() => router.push("/feedback")} />
            </View>
          )}
        </Card>
      </ScrollView>
    </ScreenBackground>
  );
}
