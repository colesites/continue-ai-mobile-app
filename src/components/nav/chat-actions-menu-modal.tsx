import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemePalette } from "@/providers/ThemeProvider";
import { Pin } from "lucide-react-native";

export type ChatActionsAnchorRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ChatActionsMenuModalProps = {
  open: boolean;
  anchorRect: ChatActionsAnchorRect | null;
  pinned: boolean;
  busy: boolean;
  onClose: () => void;
  onTogglePin: () => void;
  onRename: () => void;
  onShare: () => void;
  onDelete: () => void;
};

const MENU_WIDTH = 188;
const FALLBACK_MENU_HEIGHT = 196;
const EDGE_MARGIN = 10;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ChatActionsMenuModal({
  open,
  anchorRect,
  pinned,
  busy,
  onClose,
  onTogglePin,
  onRename,
  onShare,
  onDelete,
}: ChatActionsMenuModalProps) {
  const { palette } = useThemePalette();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const [menuHeight, setMenuHeight] = useState(0);

  const primaryColor = `rgb(${palette.primary.split(" ").join(", ")})`;
  const destructiveColor = `rgb(${palette.destructive.split(" ").join(", ")})`;

  const resolvedHeight = menuHeight || FALLBACK_MENU_HEIGHT;

  const position = useMemo(() => {
    const anchor = anchorRect ?? {
      x: window.width - MENU_WIDTH - EDGE_MARGIN,
      y: insets.top + 140,
      width: 0,
      height: 0,
    };

    const anchorCenterY = anchor.y + anchor.height / 2;
    const minTop = insets.top + EDGE_MARGIN;
    const maxTop = window.height - insets.bottom - EDGE_MARGIN - resolvedHeight;
    const top = clamp(
      anchorCenterY - resolvedHeight / 2,
      minTop,
      Math.max(minTop, maxTop),
    );

    const preferredLeft = anchor.x + anchor.width + 8;
    const openRight =
      preferredLeft + MENU_WIDTH <= window.width - insets.right - EDGE_MARGIN;
    const rawLeft = openRight ? preferredLeft : anchor.x - MENU_WIDTH - 8;
    const minLeft = insets.left + EDGE_MARGIN;
    const maxLeft = window.width - insets.right - EDGE_MARGIN - MENU_WIDTH;
    const left = clamp(rawLeft, minLeft, Math.max(minLeft, maxLeft));

    return { top, left };
  }, [
    anchorRect,
    insets.bottom,
    insets.left,
    insets.right,
    insets.top,
    resolvedHeight,
    window.height,
    window.width,
  ]);

  return (
    <Modal
      animationType="fade"
      transparent
      visible={open}
      onRequestClose={onClose}
    >
      <View style={styles.overlay} pointerEvents="box-none">
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          className="rounded-2xl border border-sidebar-border bg-sidebar py-1"
          style={[
            styles.menu,
            { width: MENU_WIDTH, top: position.top, left: position.left },
          ]}
          onLayout={(event) => {
            setMenuHeight(event.nativeEvent.layout.height);
          }}
        >
          <Pressable
            onPress={onTogglePin}
            disabled={busy}
            className={`flex-row items-center gap-3 px-4 py-3 active:bg-sidebar-accent/20 ${
              busy ? "opacity-50" : ""
            }`}
          >
            <Pin size={18} color={primaryColor} />
            <Text className="text-sm font-semibold text-sidebar-foreground">
              {pinned ? "Unpin" : "Pin"}
            </Text>
          </Pressable>

          <Pressable
            onPress={onRename}
            disabled={busy}
            className={`flex-row items-center gap-3 px-4 py-3 active:bg-sidebar-accent/20 ${
              busy ? "opacity-50" : ""
            }`}
          >
            <Feather name="edit-2" size={18} color={primaryColor} />
            <Text className="text-sm font-semibold text-sidebar-foreground">
              Rename
            </Text>
          </Pressable>

          <Pressable
            onPress={onShare}
            disabled={busy}
            className={`flex-row items-center gap-3 px-4 py-3 active:bg-sidebar-accent/20 ${
              busy ? "opacity-50" : ""
            }`}
          >
            <Feather name="share-2" size={18} color={primaryColor} />
            <Text className="text-sm font-semibold text-sidebar-foreground">
              Share
            </Text>
          </Pressable>

          <View className="h-[1px] bg-sidebar-border/80 my-1" />

          <Pressable
            onPress={onDelete}
            disabled={busy}
            className={`flex-row items-center gap-3 px-4 py-3 active:bg-sidebar-accent/20 ${
              busy ? "opacity-50" : ""
            }`}
          >
            <Feather name="trash-2" size={18} color={destructiveColor} />
            <Text className="text-sm font-semibold text-destructive">
              Delete
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  menu: {
    position: "absolute",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
});
