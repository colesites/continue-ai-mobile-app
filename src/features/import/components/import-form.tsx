import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import { Pressable, Text, TextInput, useColorScheme, View } from "react-native";

interface ImportFormProps {
  onImport: (url: string) => void;
  isLoading?: boolean;
}

export const ImportForm = ({ onImport, isLoading }: ImportFormProps) => {
  const [url, setUrl] = useState("");
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const handleSubmit = () => {
    if (url.trim() && !isLoading) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      onImport(url.trim());
    }
  };

  return (
    <View className="w-full gap-4">
      <View className="items-center gap-2 mb-4">
        <View className="p-4 bg-primary/10 rounded-full">
          <Feather name="link" size={32} color="#f472b6" />
        </View>
        <Text className="text-2xl font-bold text-foreground text-center">
          Import Conversation
        </Text>
        <Text className="text-base text-muted-foreground text-center px-8">
          Paste a shared link from ChatGPT, Gemini, or Claude to continue the
          chat here.
        </Text>
      </View>

      <View
        className={`flex-row items-center bg-muted rounded-2xl px-4 py-3 border ${
          isDark ? "border-border/50" : "border-border/30"
        }`}
      >
        <Feather
          name="globe"
          size={20}
          color={isDark ? "#9ca3af" : "#6b7280"}
        />
        <TextInput
          className="flex-1 text-base text-foreground ml-3"
          placeholder="https://chat.openai.com/share/..."
          placeholderTextColor={isDark ? "#9ca3af" : "#6b7280"}
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          editable={!isLoading}
        />
        {url.length > 0 && (
          <Pressable onPress={() => setUrl("")}>
            <Feather
              name="x-circle"
              size={18}
              color={isDark ? "#d1d5db" : "#4b5563"}
            />
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={handleSubmit}
        disabled={isLoading || !url.trim()}
        className={`w-full h-14 rounded-2xl flex-row items-center justify-center gap-2 ${
          isLoading || !url.trim() ? "bg-muted" : "bg-primary"
        }`}
      >
        <Text
          className={`text-lg font-bold ${
            isLoading || !url.trim() ? "text-muted-foreground" : "text-white"
          }`}
        >
          {isLoading ? "Analyzing Link..." : "Import Chat"}
        </Text>
        {!isLoading && <Feather name="arrow-right" size={20} color="white" />}
      </Pressable>

      <View className="bg-muted/50 rounded-2xl p-4 mt-4">
        <Text className="text-sm font-semibold text-foreground mb-2 flex-row items-center gap-2">
          <Feather name="info" size={14} color="#f472b6" /> How it works
        </Text>
        <Text className="text-sm text-muted-foreground leading-5">
          We'll automatically parse the conversation and set up a new chat
          session using the same model or a compatible alternative.
        </Text>
      </View>
    </View>
  );
};
