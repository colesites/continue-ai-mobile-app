import { Pressable, Text, View, type PressableProps } from "react-native";

import { cn } from "@/lib/utils";

type AuthGradientButtonProps = Omit<PressableProps, "children"> & {
  label: string;
  className?: string;
  textClassName?: string;
};

export function AuthGradientButton({
  label,
  className,
  textClassName,
  disabled,
  ...props
}: AuthGradientButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={cn(
        "h-14 overflow-hidden rounded-full border border-primary/40",
        disabled && "opacity-50",
        className,
      )}
      {...props}
    >
      <View className="flex-1 items-center justify-center">
        <Text className={cn("text-xl font-semibold text-foreground", textClassName)}>{label}</Text>
      </View>
    </Pressable>
  );
}
