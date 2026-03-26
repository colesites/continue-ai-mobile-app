import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import Markdown from "react-native-markdown-display";

interface MessageContentProps {
  content: string;
  isStreaming?: boolean;
}

export const MessageContent = React.memo(
  ({ content, isStreaming }: MessageContentProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const styles = StyleSheet.create({
      body: {
        color: isDark ? "#ececec" : "#374151",
        fontSize: 16,
        lineHeight: 24,
      },
      code_inline: {
        backgroundColor: isDark ? "#2d2d2d" : "#f3f4f6",
        color: isDark ? "#f87171" : "#dc2626",
        borderRadius: 4,
        paddingHorizontal: 4,
        fontFamily: "System", // Or a monospace font if available
      },
      code_block: {
        backgroundColor: isDark ? "#1a1a1a" : "#f9fafb",
        color: isDark ? "#d1d5db" : "#1f2937",
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#e5e7eb",
        fontFamily: "System",
      },
      fence: {
        backgroundColor: isDark ? "#1a1a1a" : "#f9fafb",
        borderRadius: 8,
        padding: 12,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: isDark ? "#374151" : "#e5e7eb",
      },
      link: {
        color: "#f472b6", // primary color
        textDecorationLine: "underline",
      },
      paragraph: {
        marginTop: 0,
        marginBottom: 8,
      },
      heading1: {
        fontSize: 24,
        fontWeight: "bold",
        color: isDark ? "#ffffff" : "#111827",
        marginVertical: 12,
      },
      heading2: {
        fontSize: 20,
        fontWeight: "bold",
        color: isDark ? "#ffffff" : "#111827",
        marginVertical: 10,
      },
      blockquote: {
        backgroundColor: isDark ? "#2d2d2d" : "#f3f4f6",
        borderLeftWidth: 4,
        borderLeftColor: "#f472b6",
        paddingLeft: 12,
        paddingVertical: 8,
        marginVertical: 8,
      },
    });

    return (
      <View className="flex-1">
        <Markdown style={styles}>{content}</Markdown>
        {isStreaming && (
          <View className="flex-row items-center mt-1">
            <View className="w-2 h-4 bg-primary animate-pulse" />
          </View>
        )}
      </View>
    );
  },
);

MessageContent.displayName = "MessageContent";
