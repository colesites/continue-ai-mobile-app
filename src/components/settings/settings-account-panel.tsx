import { Text, View } from "react-native";

import { SettingsLanguageDropdown } from "@/components/settings/settings-language-dropdown";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { PlanTier } from "@/lib/plan-tier";
import {
  SPEECH_AUTO_LANGUAGE,
  SPEECH_LANGUAGE_OPTIONS,
} from "@/lib/speech-settings";

type SettingsAccountPanelProps = {
  selectedLanguage: string;
  selectedLanguageLabel: string;
  usage: {
    planTier: PlanTier;
    isPaid: boolean;
    freeMonthlyUsed: number;
    freeMonthlyLimit: number;
    paidPremiumUsed: number;
    paidPremiumLimit: number;
    paidStandardUsed: number;
    paidStandardLimit: number;
    paidTotalUsed: number;
    paidTotalLimit: number;
    monthlyImportUsed: number;
    monthlyImportLimit: number | null;
  };
  onLanguageChange: (value: string) => void;
};

function toProgress(used: number, limit: number) {
  return limit > 0 ? (used / limit) * 100 : 0;
}

function UsageRow({
  label,
  used,
  limit,
  helperText,
}: {
  label: string;
  used: number;
  limit: number;
  helperText?: string;
}) {
  return (
    <View className="gap-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-semibold text-foreground">{label}</Text>
        <Text className="text-sm font-semibold text-muted-foreground">
          {used} / {limit}
        </Text>
      </View>
      <ProgressBar value={toProgress(used, limit)} />
      {helperText ? (
        <Text className="text-xs text-muted-foreground">{helperText}</Text>
      ) : null}
    </View>
  );
}

export function SettingsAccountPanel({
  selectedLanguage,
  selectedLanguageLabel,
  usage,
  onLanguageChange,
}: SettingsAccountPanelProps) {
  const importLimitLabel =
    usage.monthlyImportLimit === null ? "Unlimited" : String(usage.monthlyImportLimit);

  return (
    <View className="gap-6">
      <View>
        <Text className="text-2xl font-semibold text-foreground">Account</Text>
        <Text className="mt-1 text-sm text-muted-foreground">
          Voice input language preferences for speech recognition.
        </Text>
      </View>

      <Card className="gap-3 rounded-2xl border-border/70 bg-card/70">
        <Text className="text-base font-semibold text-foreground">
          Preferred Voice Language
        </Text>
        <Text className="text-sm text-muted-foreground">
          When you choose a specific language, voice input listens only in that language.
          Only Auto mode rotates across languages.
        </Text>

        <SettingsLanguageDropdown
          value={selectedLanguage}
          options={SPEECH_LANGUAGE_OPTIONS}
          onChange={onLanguageChange}
        />

        <View className="rounded-xl border border-border/70 bg-background/80 px-3 py-2">
          <Text className="text-xs text-muted-foreground">
            Current:{" "}
            <Text className="font-semibold text-foreground">{selectedLanguageLabel}</Text>
            {selectedLanguage === SPEECH_AUTO_LANGUAGE
              ? " (best multilingual behavior)"
              : ""}
          </Text>
        </View>
      </Card>

      <View className="gap-1">
        <Text className="text-2xl font-semibold text-foreground">Usage</Text>
        <Text className="text-sm text-muted-foreground">
          Track monthly message and import usage.
        </Text>
      </View>

      <Card className="gap-5 rounded-2xl border-border/70 bg-card/70">
        {usage.isPaid ? (
          <>
            <UsageRow
              label="Total Messages"
              used={usage.paidTotalUsed}
              limit={usage.paidTotalLimit}
            />
            <UsageRow
              label="Standard Model Messages"
              used={usage.paidStandardUsed}
              limit={usage.paidStandardLimit}
            />
            <UsageRow
              label="Premium Model Messages"
              used={usage.paidPremiumUsed}
              limit={usage.paidPremiumLimit}
            />
          </>
        ) : (
          <UsageRow
            label="Free Model Messages"
            used={usage.freeMonthlyUsed}
            limit={usage.freeMonthlyLimit}
            helperText="Upgrade to Starter or Pro for higher limits and premium models."
          />
        )}

        <View className="gap-2">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-foreground">
              Monthly Imports
            </Text>
            <Text className="text-sm font-semibold text-muted-foreground">
              {usage.monthlyImportUsed} / {importLimitLabel}
            </Text>
          </View>
          {usage.monthlyImportLimit !== null ? (
            <ProgressBar
              value={toProgress(usage.monthlyImportUsed, usage.monthlyImportLimit)}
            />
          ) : null}
          <Text className="text-xs text-muted-foreground">
            {usage.monthlyImportLimit === null
              ? "Pro plan includes unlimited imports per month."
              : "Monthly import limits reset at the start of each UTC month."}
          </Text>
        </View>
      </Card>
    </View>
  );
}
