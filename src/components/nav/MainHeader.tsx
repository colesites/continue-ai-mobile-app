import { useThemePalette } from "@/providers/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigationContainerRef, usePathname } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeSelectorSheet } from "./theme-selector-sheet";

type MainHeaderProps = {
  canvasMenu?: {
    tab: "community" | "mine";
    onSelectTab: (tab: "community" | "mine") => void;
  };
};

export function MainHeader({ canvasMenu }: MainHeaderProps) {
  const navigationRef = useNavigationContainerRef();
  const { mode, palette } = useThemePalette();
  const [themeSheetOpen, setThemeSheetOpen] = useState(false);
  const [canvasMenuOpen, setCanvasMenuOpen] = useState(false);
  const [canvasTriggerWidth, setCanvasTriggerWidth] = useState(0);
  const pathname = usePathname();
  const iconColor = `rgb(${palette.foreground})`;

  const openDrawer = () => {
    navigationRef.current?.dispatch(DrawerActions.openDrawer());
  };

  const modeIcon =
    mode === "dark" ? "moon" : mode === "light" ? "sun" : "monitor";

  const insets = useSafeAreaInsets();
  const isCanvasRoute = pathname?.includes("/canvas");
  const showCanvasMenu = Boolean(isCanvasRoute && canvasMenu);
  const currentCanvasLabel =
    canvasMenu?.tab === "mine" ? "My Creations" : "Community";

  return (
    <View className="absolute inset-0 z-50" pointerEvents="box-none">
      {showCanvasMenu && canvasMenuOpen ? (
        <Pressable
          className="absolute inset-0"
          onPress={() => setCanvasMenuOpen(false)}
        />
      ) : null}

      <View
        className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-6 py-2"
        style={{ paddingTop: insets.top }}
      >
        {/* Left side: Navigation Group */}
        <View className="flex-row items-center bg-secondary/30 rounded-2xl p-0.5 border border-border/40">
          <Pressable
            onPress={openDrawer}
            className="p-3 rounded-xl active:bg-muted"
          >
            <Feather name="sidebar" size={20} color={iconColor} />
          </Pressable>

          <View className="w-[1px] h-4 bg-border/40 mx-0.5" />

          <Pressable className="p-3 rounded-xl active:bg-muted">
            <Feather name="search" size={20} color={iconColor} />
          </Pressable>

          <Pressable className="p-3 rounded-xl active:bg-muted">
            <Feather name="plus" size={20} color={iconColor} />
          </Pressable>
        </View>

        {/* Right side: Theme Toggle - Rounded Rectangle */}
        <Pressable
          onPress={() => setThemeSheetOpen(true)}
          className="w-12 h-12 items-center justify-center rounded-2xl bg-secondary/30 border border-border/40"
        >
          <Feather name={modeIcon} size={22} color={iconColor} />
        </Pressable>

        {showCanvasMenu ? (
          <View
            className="absolute left-0 right-0 items-center"
            style={{ top: insets.top + 1 }}
            pointerEvents="box-none"
          >
            <View className="relative">
              <View className="rounded-2xl border border-border/40 bg-secondary/30 p-0.5">
                <Pressable
                  onPress={() => setCanvasMenuOpen((prev) => !prev)}
                  className="flex-row h-12 items-center gap-2 rounded-xl px-4"
                  onLayout={(event) => {
                    const width = Math.round(event.nativeEvent.layout.width);
                    if (width && width !== canvasTriggerWidth) {
                      setCanvasTriggerWidth(width);
                    }
                  }}
                >
                  <Text className="text-sm font-semibold text-foreground">
                    {currentCanvasLabel}
                  </Text>
                  <Feather name="chevron-down" size={16} color={iconColor} />
                </Pressable>
              </View>

              {canvasMenuOpen ? (
                <View
                  className="absolute z-[200] rounded-2xl border border-border bg-card p-2 shadow-xl"
                  style={{
                    top: -8,
                    left: -6,
                    width: Math.max((canvasTriggerWidth || 160) + 20, 180),
                  }}
                >
                  <Pressable
                    onPress={() => {
                      canvasMenu?.onSelectTab("community");
                      setCanvasMenuOpen(false);
                    }}
                    className={`flex-row items-center justify-between rounded-xl px-3 py-2.5 ${
                      canvasMenu?.tab === "community"
                        ? "bg-secondary"
                        : "bg-transparent"
                    }`}
                  >
                    <Text className="text-sm font-semibold text-foreground">
                      Community
                    </Text>
                    {canvasMenu?.tab === "community" ? (
                      <Feather name="check" size={16} color={iconColor} />
                    ) : null}
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      canvasMenu?.onSelectTab("mine");
                      setCanvasMenuOpen(false);
                    }}
                    className={`flex-row items-center justify-between rounded-xl px-3 py-2.5 ${
                      canvasMenu?.tab === "mine"
                        ? "bg-secondary"
                        : "bg-transparent"
                    }`}
                  >
                    <Text className="text-sm font-semibold text-foreground">
                      My Creations
                    </Text>
                    {canvasMenu?.tab === "mine" ? (
                      <Feather name="check" size={16} color={iconColor} />
                    ) : null}
                  </Pressable>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        <ThemeSelectorSheet
          open={themeSheetOpen}
          onClose={() => setThemeSheetOpen(false)}
        />
      </View>
    </View>
  );
}
