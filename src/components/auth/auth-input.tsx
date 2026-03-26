import type { ReactNode } from "react";
import { TextInput, View, type TextInputProps } from "react-native";

import { cn } from "@/lib/utils";

type AuthInputProps = TextInputProps & {
  leftIcon?: ReactNode;
  className?: string;
  inputClassName?: string;
};

export function AuthInput({
  leftIcon,
  className,
  inputClassName,
  ...props
}: AuthInputProps) {
  return (
    <View className={cn("h-14 flex-row items-center rounded-full border border-input bg-card px-4", className)}>
      {leftIcon ? <View className="mr-3">{leftIcon}</View> : null}
      <TextInput
        className={cn("flex-1 text-base text-foreground", inputClassName)}
        {...props}
      />
    </View>
  );
}
