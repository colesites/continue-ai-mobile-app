import { useEffect, useMemo, useState } from "react";
import {
  deriveCapabilities,
  deriveIsPremium,
  fetchAiGatewayModels,
  type ModelCapability,
} from "@/lib/model-capabilities";
import { ALWAYS_FREE_MODEL_IDS } from "@/lib/models";

export function useModelCapabilities() {
  const [capabilitiesById, setCapabilitiesById] = useState<Record<string, ModelCapability[]>>({});
  const [premiumById, setPremiumById] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const models = await fetchAiGatewayModels();
        if (cancelled) return;

        const nextCapabilities: Record<string, ModelCapability[]> = {};
        const nextPremium: Record<string, boolean> = {};

        for (const model of models) {
          nextCapabilities[model.id] = deriveCapabilities(model);
          nextPremium[model.id] = deriveIsPremium(model);
        }

        setCapabilitiesById(nextCapabilities);
        setPremiumById(nextPremium);
      } catch {
        if (cancelled) return;
        setCapabilitiesById({});
        setPremiumById({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () => ({
      getCapabilities: (modelId: string) => capabilitiesById[modelId] ?? [],
      isPremium: (modelId: string) => (ALWAYS_FREE_MODEL_IDS.has(modelId) ? false : premiumById[modelId] ?? true),
      capabilitiesById,
      premiumById,
    }),
    [capabilitiesById, premiumById],
  );
}
