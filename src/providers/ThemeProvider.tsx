import { vars } from "nativewind";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme as useSystemColorScheme, View } from "react-native";

import {
  getSavedMode,
  getSavedTheme,
  setSavedMode,
  setSavedTheme,
  type AppMode,
  type Theme,
} from "@/lib/theme";
import {
  getThemePalette,
  toThemeVars,
  type Scheme,
  type SemanticPalette,
} from "@/lib/theme-palettes";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  scheme: Scheme;
  palette: SemanticPalette;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

type ThemeProviderProps = PropsWithChildren<{
  forcedTheme?: Theme;
}>;

export function ThemeProvider({ children, forcedTheme }: ThemeProviderProps) {
  const systemScheme = useSystemColorScheme();
  const [storedTheme, setStoredTheme] = useState<Theme>(
    () => getSavedTheme() ?? "default",
  );
  const [storedMode, setStoredMode] = useState<AppMode>(
    () => getSavedMode() ?? "system",
  );

  const theme = forcedTheme ?? storedTheme;
  const mode = storedMode;

  const scheme: Scheme = useMemo(() => {
    if (mode === "system") {
      return systemScheme === "light" ? "light" : "dark";
    }
    return mode;
  }, [mode, systemScheme]);

  const palette = useMemo(
    () => getThemePalette(theme, scheme),
    [theme, scheme],
  );

  const setTheme = (nextTheme: Theme) => {
    if (forcedTheme) return;
    setStoredTheme(nextTheme);
    setSavedTheme(nextTheme);
  };

  const setMode = (nextMode: AppMode) => {
    setStoredMode(nextMode);
    setSavedMode(nextMode);
  };

  const cssVars = useMemo(() => {
    return vars(toThemeVars(palette));
  }, [palette]);

  const value = useMemo(
    () => ({ theme, setTheme, mode, setMode, scheme, palette }),
    [scheme, theme, mode, palette],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View style={cssVars} className="flex-1 bg-background">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useThemePalette() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemePalette must be used within ThemeProvider");
  }

  return context;
}
