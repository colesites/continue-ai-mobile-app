import type { ReactNode } from "react";
import { TextInput, View, type TextInputProps } from "react-native";

import { cn } from "@/lib/utils";

type InputProps = TextInputProps & {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  className?: string;
};

export function Input({
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  ...props
}: InputProps) {
  return (
    <View
      className={cn(
        "h-14 flex-row items-center rounded-full border border-input bg-card/35 px-4",
        containerClassName,
      )}
    >
      {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}
      <TextInput className={cn("flex-1 text-base text-foreground", className)} {...props} />
      {rightIcon ? <View className="ml-3">{rightIcon}</View> : null}
    </View>
  );
}
