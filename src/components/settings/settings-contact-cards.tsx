import { Feather } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Pressable, Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { useThemePalette } from "@/providers/ThemeProvider";

type ContactCard = {
  title: string;
  description: string;
  href: string;
  icon: keyof typeof Feather.glyphMap;
};

const CONTACTS: ContactCard[] = [
  {
    title: "Have a feature idea?",
    description: "Share product ideas the team and community can vote on.",
    href: "/feedback",
    icon: "help-circle",
  },
  {
    title: "Found a bug?",
    description: "Report issues quickly with clear details and reproduction notes.",
    href: "/feedback",
    icon: "alert-triangle",
  },
  {
    title: "Privacy Policy",
    description: "How your data is handled.",
    href: "https://kontinueai.com/legal/privacy-policy",
    icon: "shield",
  },
  {
    title: "Terms of Service",
    description: "Usage terms and responsibilities.",
    href: "https://kontinueai.com/legal/terms-of-service",
    icon: "file-text",
  },
];

type SettingsContactCardsProps = {
  onOpenFeedback: () => void;
};

export function SettingsContactCards({ onOpenFeedback }: SettingsContactCardsProps) {
  const { palette } = useThemePalette();
  const iconColor = `rgb(${palette.foreground})`;

  return (
    <View className="gap-3">
      {CONTACTS.map((item) => (
        <Card key={item.title} className="rounded-2xl border-border/70 bg-card/70 p-0">
          <Pressable
            className="gap-2 px-4 py-3.5"
            onPress={() => {
              if (item.href === "/feedback") {
                onOpenFeedback();
              } else {
                void Linking.openURL(item.href);
              }
            }}
          >
            <View className="flex-row items-center gap-2">
              <Feather name={item.icon} size={14} color={iconColor} />
              <Text className="text-base font-semibold text-foreground">{item.title}</Text>
            </View>
            <Text className="text-sm text-muted-foreground">{item.description}</Text>
            <View className="mt-0.5 flex-row items-center gap-1">
              <Text className="text-sm font-semibold text-primary">Open</Text>
              <Feather name="external-link" size={12} color={`rgb(${palette.primary})`} />
            </View>
          </Pressable>
        </Card>
      ))}
    </View>
  );
}
