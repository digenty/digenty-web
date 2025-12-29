"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const INVOICE_STEPS = [
  { key: "details", label: "Details" },
  { key: "items", label: "Items" },
  { key: "status", label: "Status" },
] as const;

export type InvoiceStep = (typeof INVOICE_STEPS)[number]["key"];

export function useInvoiceStep() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stepFromUrl = searchParams.get("step") as InvoiceStep | null;
  const [step, setStep] = useState<InvoiceStep>("details");

  useEffect(() => {
    if (stepFromUrl) setStep(stepFromUrl);
  }, [stepFromUrl]);

  const goToStep = (next: InvoiceStep) => {
    setStep(next);
    router.replace(`?step=${next}`, { scroll: false });
  };

  return { step, goToStep };
}
