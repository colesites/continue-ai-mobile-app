import React from "react";
import { Text, useColorScheme, View } from "react-native";
import type { ChatMessage } from "../types";
import { MessageContent } from "./message-content";

interface MessageItemProps {
  message: ChatMessage;
  isStreaming?: boolean;
}

export const MessageItem = React.memo(
  ({ message, isStreaming }: MessageItemProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    const isUser = message.role === "user";

    return (
      <View
        className={`flex-row px-4 py-3 ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        <View
          className={`max-w-[85%] rounded-2xl px-4 py-2 ${
            isUser
              ? "bg-primary border border-primary/20"
              : isDark
                ? "bg-muted border border-border/50"
                : "bg-muted/30 border border-border/30"
          }`}
        >
          {!isUser && (
            <Text className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">
              {message.modelId ? message.modelId.split("/")[1] : "Assistant"}
            </Text>
          )}

          <MessageContent
            content={message.content}
            isStreaming={isStreaming && !isUser}
          />

          <View className="flex-row items-center justify-end mt-1 opacity-50">
            <Text
              className={`text-[10px] ${
                isUser ? "text-white" : "text-muted-foreground"
              }`}
            >
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  },
);

MessageItem.displayName = "MessageItem";
