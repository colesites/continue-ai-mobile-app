import { Text, View } from "react-native";

import { cn } from "@/lib/utils";

type SeparatorProps = {
  label?: string;
  className?: string;
  lineClassName?: string;
  labelClassName?: string;
};

export function Separator({ label, className, lineClassName, labelClassName }: SeparatorProps) {
  if (!label) {
    return <View className={cn("h-px w-full bg-border", className)} />;
  }

  return (
    <View className={cn("flex-row items-center gap-3", className)}>
      <View className={cn("h-px flex-1 bg-border", lineClassName)} />
      <Text className={cn("text-sm text-muted-foreground", labelClassName)}>{label}</Text>
      <View className={cn("h-px flex-1 bg-border", lineClassName)} />
    </View>
  );
}
