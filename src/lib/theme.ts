import { getStoredValue, setStoredValue } from "@/lib/simple-storage";

export const THEMES = [
  "default",
  "emerald",
  "chelsea",
  "amethyst",
  "normal",
] as const;
export type Theme = (typeof THEMES)[number];

export const APP_MODES = ["light", "dark", "system"] as const;
export type AppMode = (typeof APP_MODES)[number];

const THEME_STORAGE_KEY = "ui-theme";
const MODE_STORAGE_KEY = "ui-mode";
const THEME_ONBOARDING_KEY = "theme-onboarding-completed";

const THEME_LABELS: Record<Theme, string> = {
  default: "Default",
  emerald: "Emerald",
  chelsea: "Chelsea Blue",
  amethyst: "Amethyst",
  normal: "Normal",
};

const THEME_PRIMARY_COLORS: Record<Theme, string> = {
  default: "#e91e63",
  emerald: "#10b981",
  chelsea: "#0047AB",
  amethyst: "#a855f7",
  normal: "#000000",
};

export function getSavedTheme(): Theme | null {
  const saved = getStoredValue(THEME_STORAGE_KEY);
  if (!saved) return null;

  if (saved === "chelsea-blue") {
    return "chelsea";
  }

  return THEMES.includes(saved as Theme) ? (saved as Theme) : null;
}

export function setSavedTheme(theme: Theme): void {
  setStoredValue(THEME_STORAGE_KEY, theme);
}

export function getSavedMode(): AppMode | null {
  const saved = getStoredValue(MODE_STORAGE_KEY);
  if (!saved) return null;
  return APP_MODES.includes(saved as AppMode) ? (saved as AppMode) : null;
}

export function setSavedMode(mode: AppMode): void {
  setStoredValue(MODE_STORAGE_KEY, mode);
}

export function hasCompletedThemeOnboarding(): boolean {
  return getStoredValue(THEME_ONBOARDING_KEY) === "true";
}

export function markThemeOnboardingComplete(): void {
  setStoredValue(THEME_ONBOARDING_KEY, "true");
}

export function getThemeLabel(theme: Theme): string {
  return THEME_LABELS[theme];
}

export function getThemePrimaryColor(theme: Theme): string {
  return THEME_PRIMARY_COLORS[theme];
}
