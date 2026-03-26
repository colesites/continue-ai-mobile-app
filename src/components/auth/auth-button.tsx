import type { ReactNode } from "react";
import { Pressable, Text, View, type PressableProps } from "react-native";

import { cn } from "@/lib/utils";

type AuthButtonProps = Omit<PressableProps, "children"> & {
  label?: string;
  icon?: ReactNode;
  children?: ReactNode;
  size?: "pill" | "circle";
  className?: string;
  textClassName?: string;
};

export function AuthButton({
  label,
  icon,
  children,
  size = "pill",
  className,
  textClassName,
  disabled,
  ...props
}: AuthButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={cn(
        "items-center justify-center overflow-hidden border border-input bg-card",
        size === "pill" ? "h-14 rounded-full" : "h-11 w-11 rounded-full",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {children ?? (
        <View className="flex-row items-center gap-3">
          {icon}
          {label ? <Text className={cn("text-base font-medium text-foreground", textClassName)}>{label}</Text> : null}
        </View>
      )}
    </Pressable>
  );
}
