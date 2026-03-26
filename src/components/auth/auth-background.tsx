import { View } from "react-native";

import { cn } from "@/lib/utils";

type AuthBackgroundProps = {
  isDarkScheme: boolean;
};

export function AuthBackground({ isDarkScheme }: AuthBackgroundProps) {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      <View className="absolute inset-0 bg-background" />

      <View
        className={cn(
          "absolute -left-52 -top-20 h-[900px] w-[760px] rounded-full",
          isDarkScheme ? "bg-primary/26" : "bg-primary/16",
        )}
      />
      <View
        className={cn(
          "absolute -left-40 top-16 h-[760px] w-[620px] rounded-full",
          isDarkScheme ? "bg-accent/20" : "bg-accent/12",
        )}
      />
      <View
        className={cn(
          "absolute -right-48 top-6 h-[460px] w-[460px] rounded-full",
          isDarkScheme ? "bg-primary/12" : "bg-primary/8",
        )}
      />

      <View className={cn("absolute inset-0", isDarkScheme ? "bg-background/84" : "bg-background/78")} />
    </View>
  );
}
