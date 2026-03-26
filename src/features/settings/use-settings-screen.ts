import { useMemo } from "react";

import { useAppState } from "@/contexts/app-state-context";
import { SPEECH_LANGUAGE_OPTIONS } from "@/lib/speech-settings";

export function useSettingsScreen() {
  const { settings, setPlanTier, setSpeechLanguage } = useAppState();

  const selectedLanguageLabel = useMemo(() => {
    const selected = SPEECH_LANGUAGE_OPTIONS.find((option) => option.value === settings.speechLanguage);
    return selected?.label ?? "Auto detect (Recommended)";
  }, [settings.speechLanguage]);

  const usage = useMemo(() => {
    const isPaid = settings.planTier !== "free";

    return {
      planTier: settings.planTier,
      isPaid,
      freeMonthlyUsed: 15,
      freeMonthlyLimit: 30,
      paidPremiumUsed: settings.planTier === "pro" ? 42 : 12,
      paidPremiumLimit: settings.planTier === "pro" ? 100 : 30,
      paidStandardUsed: settings.planTier === "pro" ? 220 : 90,
      paidStandardLimit: settings.planTier === "pro" ? 1400 : 270,
      paidTotalUsed:
        settings.planTier === "pro" ? 42 + 220 : 12 + 90,
      paidTotalLimit: settings.planTier === "pro" ? 1500 : 300,
      monthlyImportUsed: 1,
      monthlyImportLimit:
        settings.planTier === "pro" ? null : settings.planTier === "starter" ? 1000 : 10,
    };
  }, [settings.planTier]);

  return {
    settings,
    usage,
    selectedLanguageLabel,
    setPlanTier,
    setSpeechLanguage,
  };
}
