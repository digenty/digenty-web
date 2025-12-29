"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const FEES_STEPS = [
  { key: "details", label: "Fees Details" },
  { key: "branch", label: "Branch" },
  { key: "classes", label: "Classes" },
  { key: "amount", label: "Amount" },
] as const;

type FeesStep = (typeof FEES_STEPS)[number]["key"];

export function useFeesStep() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepFromUrl = searchParams.get("step") as FeesStep | null;
  const [step, setStep] = useState<FeesStep>("details");

  useEffect(() => {
    if (stepFromUrl) setStep(stepFromUrl);
  }, [stepFromUrl]);

  const goToStep = (next: FeesStep) => {
    setStep(next);
    router.replace(`?step=${next}`, { scroll: false });
  };

  return { step, goToStep };
}
