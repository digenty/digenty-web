"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const FEE_COLLECTION_STEPS = [
  { key: "choose-mode", label: "Choose Mode" },
  { key: "account-setup", label: "Account Setup" },
  { key: "routing", label: "Routing" },
  { key: "review", label: "Review" },
] as const;

export const ALL_STEP_KEYS = ["choose-mode", "account-setup", "routing-decision", "fee-routing", "review"] as const;

export type FeeCollectionStepKey = (typeof ALL_STEP_KEYS)[number];

// Maps URL key → internal activeStep number (-1 to 3)
const KEY_TO_ACTIVE: Record<FeeCollectionStepKey, number> = {
  "choose-mode": -1,
  "account-setup": 0,
  "routing-decision": 1,
  "fee-routing": 2,
  review: 3,
};

// Maps internal activeStep number → URL key
const ACTIVE_TO_KEY: Record<number, FeeCollectionStepKey> = {
  [-1]: "choose-mode",
  0: "account-setup",
  1: "routing-decision",
  2: "fee-routing",
  3: "review",
};

function parseStepKey(raw: string | null): FeeCollectionStepKey | null {
  if (raw && (ALL_STEP_KEYS as readonly string[]).includes(raw)) {
    return raw as FeeCollectionStepKey;
  }
  return null;
}

export function useFeeCollectionStep() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keyFromUrl = parseStepKey(searchParams.get("step"));
  const [activeStep, setActiveStep] = useState<number>(keyFromUrl ? KEY_TO_ACTIVE[keyFromUrl] : -1);

  useEffect(() => {
    if (keyFromUrl !== null) {
      setActiveStep(KEY_TO_ACTIVE[keyFromUrl]);
    }
  }, [keyFromUrl]);

  const goToStep = (next: number) => {
    const key = ACTIVE_TO_KEY[next];
    setActiveStep(next);
    if (key) router.replace(`?step=${key}`, { scroll: false });
  };

  return { activeStep, goToStep };
}
