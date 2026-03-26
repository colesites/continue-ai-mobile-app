import type { ReactNode } from "react";
import { Pressable, Text } from "react-native";

type AppButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  icon?: ReactNode;
};

export function AppButton({ label, onPress, disabled, variant = "primary", icon }: AppButtonProps) {
  const classes =
    variant === "primary"
      ? "bg-primary"
      : variant === "secondary"
        ? "bg-secondary border border-border"
        : "bg-transparent";

  const textClass =
    variant === "primary"
      ? "text-primary-foreground"
      : variant === "secondary"
        ? "text-secondary-foreground"
        : "text-foreground";

  return (
    <Pressable
      className={`flex-row items-center justify-center gap-2 rounded-xl px-4 py-3 ${classes} ${disabled ? "opacity-40" : ""}`}
      onPress={onPress}
      disabled={disabled}
    >
      {icon}
      <Text className={`text-sm font-semibold ${textClass}`}>{label}</Text>
    </Pressable>
  );
}
