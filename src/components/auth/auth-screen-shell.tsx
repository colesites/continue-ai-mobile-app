import type { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";

type AuthScreenShellProps = PropsWithChildren<{
  title: string;
  subtitle: string;
}>;

export function AuthScreenShell({ title, subtitle, children }: AuthScreenShellProps) {
  return (
    <View className="flex-1 bg-background">
      <View pointerEvents="none" className="absolute inset-0">
      </View>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="min-h-full justify-center px-5 py-10"
        >
            <View className="gap-5">
              <View className="gap-3">
                <View className="self-start rounded-full border border-border/70 bg-card/70 px-3 py-1">
                  <Text className="text-[11px] font-semibold uppercase tracking-[1.8px] text-muted-foreground">
                    Kontinue AI
                  </Text>
                </View>
                <Text className="text-[32px] font-semibold leading-10 text-foreground">{title}</Text>
                <Text className="text-sm leading-6 text-muted-foreground">{subtitle}</Text>
              </View>
              <View className="gap-4">{children}</View>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
