import { View } from "react-native";

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const width = `${Math.max(0, Math.min(100, value))}%` as `${number}%`;

  return (
    <View className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <View className="h-full rounded-full bg-primary" style={{ width }} />
    </View>
  );
}
