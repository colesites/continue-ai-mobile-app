import type { ReactNode } from "react";
import { Pressable, Text, type PressableProps } from "react-native";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "lg" | "icon";

type ButtonProps = PressableProps & {
  label?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  textClassName?: string;
};

const BUTTON_VARIANTS: Record<ButtonVariant, { container: string; text: string }> = {
  default: {
    container: "bg-primary",
    text: "text-primary-foreground",
  },
  outline: {
    container: "border border-input bg-card/40",
    text: "text-card-foreground",
  },
  ghost: {
    container: "bg-transparent",
    text: "text-foreground",
  },
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  default: "h-12 rounded-lg px-4",
  lg: "h-14 rounded-full px-5",
  icon: "h-11 w-11 rounded-full",
};

export function Button({
  label,
  children,
  variant = "default",
  size = "default",
  className,
  textClassName,
  disabled,
  ...props
}: ButtonProps) {
  const styles = BUTTON_VARIANTS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={cn(
        "items-center justify-center",
        BUTTON_SIZES[size],
        styles.container,
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      {label ? (
        <Text className={cn("text-base font-semibold", styles.text, textClassName)}>{label}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
