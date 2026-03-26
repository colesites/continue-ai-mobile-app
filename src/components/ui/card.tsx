import type { PropsWithChildren } from "react";
import { View } from "react-native";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className }: CardProps) {
  return (
    <View className={`rounded-2xl border border-border bg-card p-4 ${className ?? ""}`.trim()}>
      {children}
    </View>
  );
}
