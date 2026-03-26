import { Feather } from "@expo/vector-icons";
import { Pressable, type PressableProps } from "react-native";

import { cn } from "@/lib/utils";

type CheckboxProps = Omit<PressableProps, "onPress"> & {
  checked: boolean;
  onCheckedChange: (nextValue: boolean) => void;
  className?: string;
};

export function Checkbox({
  checked,
  onCheckedChange,
  disabled,
  className,
  ...props
}: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled: !!disabled }}
      disabled={disabled}
      className={cn(
        "h-6 w-6 items-center justify-center rounded-md border border-input bg-card/35",
        checked && "border-primary bg-primary/25",
        disabled && "opacity-50",
        className,
      )}
      onPress={() => onCheckedChange(!checked)}
      {...props}
    >
      {checked ? <Feather name="check" size={14} color="#ffffff" /> : null}
    </Pressable>
  );
}
