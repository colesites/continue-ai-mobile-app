import { useMemo, useRef, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Card } from "@/components/ui/card";
import { getCanvasModelById } from "@/lib/canvas-models";
import { useThemePalette } from "@/providers/ThemeProvider";

type CanvasInputBarProps = {
  prompt: string;
  onChangePrompt: (value: string) => void;
  mode: "image" | "video";
  onChangeMode: (mode: "image" | "video") => void;
  modelId: string;
  isGenerating: boolean;
  onGenerate: () => void;
};

function Pill({
  label,
  selected,
  onPress,
  disabled,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`rounded-full border px-4 py-1.5 ${selected ? "bg-secondary border-border" : "bg-card border-border/70"} ${
        disabled ? "opacity-60" : ""
      }`}
    >
      <Text className={`text-[11px] font-extrabold tracking-[2px] ${selected ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </Text>
    </Pressable>
  );
}

export function CanvasInputBar({
  prompt,
  onChangePrompt,
  mode,
  onChangeMode,
  modelId,
  isGenerating,
  onGenerate,
}: CanvasInputBarProps) {
  const { palette } = useThemePalette();
  const iconColor = useMemo(() => `rgb(${palette.mutedForeground})`, [palette.mutedForeground]);
  const activeIconColor = useMemo(() => `rgb(${palette.primaryForeground})`, [palette.primaryForeground]);
  const model = getCanvasModelById(modelId);
  const modelLabel = model?.name?.toUpperCase() ?? "MODEL";
  const modelLabelCompact = modelLabel.split(" ").slice(0, 2).join(" ");
  const typeTriggerRef = useRef<View>(null);
  const [typeMenuAnchor, setTypeMenuAnchor] = useState({ x: 16, y: 0 });

  const canSubmit = !isGenerating && !!prompt.trim();
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const selectMode = (nextMode: "image" | "video") => {
    onChangeMode(nextMode);
    setShowTypeMenu(false);
  };

  const openTypeMenu = () => {
    typeTriggerRef.current?.measureInWindow((x, y, _width, _height) => {
      setTypeMenuAnchor({
        x: Math.max(16, Math.round(x)),
        y: Math.max(24, Math.round(y) - 132),
      });
      setShowTypeMenu(true);
    });
  };

  return (
    <>
      <Card className="rounded-[2rem] border-border bg-card p-2.5">
        {/* Prompt input + generate arrow */}
        <View className="flex-row items-center gap-2">
          <View className="h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary">
            <Feather name="paperclip" size={18} color={iconColor} />
          </View>

          <TextInput
            value={prompt}
            onChangeText={onChangePrompt}
            placeholder={mode === "image" ? "What do you want to create?" : "Describe a video scene..."}
            placeholderTextColor={iconColor}
            className="flex-1 py-1 text-sm font-semibold text-foreground"
            editable={!isGenerating}
          />
          <Pressable
            className={`h-9 w-9 items-center justify-center rounded-full ${
              canSubmit ? "bg-primary" : "bg-secondary"
            }`}
            onPress={() => {
              if (!canSubmit) return;
              onGenerate();
            }}
            disabled={!canSubmit}
          >
            <Feather name="arrow-up" size={16} color={canSubmit ? activeIconColor : iconColor} />
          </Pressable>
        </View>

        {/* Bottom pills (match screenshot) */}
        <View className="flex-row items-center gap-2 pt-2.5">
          <View collapsable={false} ref={typeTriggerRef}>
            <Pill label={mode === "image" ? "IMAGE" : "VIDEO"} selected disabled={isGenerating} onPress={openTypeMenu} />
          </View>

          <Pressable
            className="h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary"
            onPress={openTypeMenu}
          >
            <Feather name="sliders" size={16} color={iconColor} />
          </Pressable>

          <View className="mx-1 h-5 w-px bg-border" />
          <Pill label={modelLabelCompact} disabled />
        </View>
      </Card>

      <Modal transparent visible={showTypeMenu} animationType="fade" onRequestClose={() => setShowTypeMenu(false)}>
        <View className="flex-1">
          <Pressable className="absolute inset-0" onPress={() => setShowTypeMenu(false)} />
          <View
            className="absolute w-[190px] rounded-2xl border border-border bg-card p-2.5 shadow-xl"
            style={{ left: typeMenuAnchor.x, top: typeMenuAnchor.y }}
          >
            <Text className="px-2 pb-2 text-xs font-extrabold tracking-[2px] text-muted-foreground">TYPE</Text>

            <Pressable
              onPress={() => selectMode("image")}
              className={`flex-row items-center justify-between rounded-xl px-3 py-2.5 ${mode === "image" ? "bg-secondary" : "bg-transparent"}`}
            >
              <View className="flex-row items-center gap-2">
                <Feather name="image" size={16} color={iconColor} />
                <Text className="text-lg font-semibold text-foreground">IMAGE</Text>
              </View>
              {mode === "image" ? <View className="h-2 w-2 rounded-full bg-foreground" /> : null}
            </Pressable>

            <Pressable
              onPress={() => selectMode("video")}
              className={`flex-row items-center justify-between rounded-xl px-3 py-2.5 ${mode === "video" ? "bg-secondary" : "bg-transparent"}`}
            >
              <View className="flex-row items-center gap-2">
                <Feather name="video" size={16} color={iconColor} />
                <Text className="text-lg font-semibold text-foreground">VIDEO</Text>
              </View>
              {mode === "video" ? <View className="h-2 w-2 rounded-full bg-foreground" /> : null}
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
