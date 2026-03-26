import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { Card } from "@/components/ui/card";
import { AppButton } from "@/components/ui/app-button";
import { PROVIDER_CONFIG } from "@/utils/url-safety";

type ImportCardProps = {
  url: string;
  provider: keyof typeof PROVIDER_CONFIG;
  isImporting: boolean;
  onChangeUrl: (value: string) => void;
  onImport: () => void;
};

export function ImportCard({ url, provider, isImporting, onChangeUrl, onImport }: ImportCardProps) {
  return (
    <Card className="gap-3 rounded-3xl bg-[#0d1322]/85">
      <View className="gap-1">
        <Text className="text-base font-semibold text-slate-50">Import a shared chat link</Text>
        <Text className="text-sm text-slate-300">
          Paste a HTTPS share URL. We will attempt to pull message history and open it in chat.
        </Text>
      </View>

      <TextInput
        value={url}
        onChangeText={onChangeUrl}
        autoCapitalize="none"
        placeholder="https://chatgpt.com/share/..."
        placeholderTextColor="#7a86a5"
        className="rounded-xl border border-slate-700 bg-[#0a101d] px-4 py-3 text-sm text-slate-100"
      />

      <View className="flex-row items-center justify-between">
        <Text className="text-xs text-slate-300">Detected provider: {PROVIDER_CONFIG[provider].name}</Text>
        {isImporting ? <ActivityIndicator size="small" color="#f472b6" /> : null}
      </View>

      <AppButton label={isImporting ? "Importing..." : "Import chat"} onPress={onImport} disabled={isImporting} />
    </Card>
  );
}
