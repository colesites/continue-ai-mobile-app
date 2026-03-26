import React, { useEffect, useRef } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import type { ChatMessage } from "../types";
import { MessageItem } from "./message-item";

interface ChatListProps {
  messages: ChatMessage[];
  isStreaming?: boolean;
}

export const ChatList = ({ messages, isStreaming }: ChatListProps) => {
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length, isStreaming]);

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item, index }) => (
        <MessageItem
          message={item}
          isStreaming={isStreaming && index === messages.length - 1}
        />
      )}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={<View style={{ height: 20 }} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 16,
  },
});
