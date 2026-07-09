"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AlertFill, CheckboxCircleFill } from "@digenty/icons";
import { Spinner } from "@/components/ui/spinner";
import { useVerifyPaymentInvoice } from "@/hooks/queryHooks/usePayment";

const MAX_ATTEMPTS = 12;
const POLL_INTERVAL_MS = 2500;
const TIMEOUT_MS = MAX_ATTEMPTS * POLL_INTERVAL_MS + POLL_INTERVAL_MS;

export const PaymentVerify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const invoiceId = Number(searchParams.get("invoiceId")) || undefined;
  const hasSettled = useRef(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    if (!invoiceId) router.replace("/parents/parent-fees");
  }, [invoiceId, router]);

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), TIMEOUT_MS);
    return () => clearTimeout(t);
  }, []);

  const { data, isError } = useVerifyPaymentInvoice(invoiceId, MAX_ATTEMPTS);

  const settled = data?.status === "PAID" || data?.status === "FULLY_PAID";
  const exhausted = timedOut;

  // Once the webhook has reconciled the payment, refresh the parent's fee views.
  useEffect(() => {
    if (settled && !hasSettled.current) {
      hasSettled.current = true;
      queryClient.invalidateQueries({ queryKey: ["parentFeeOverview"] });
      queryClient.invalidateQueries({ queryKey: ["parentFeeInvoice"] });
      queryClient.invalidateQueries({ queryKey: ["parentPayFees"] });
    }
  }, [settled, queryClient]);

  if (!invoiceId) return null;

  if (settled) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="bg-bg-basic-green-subtle border-bg-basic-green-accent flex size-14 items-center justify-center rounded-full border">
          <CheckboxCircleFill fill="var(--color-icon-success)" className="size-7" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-text-default text-base font-semibold">Payment successful</p>
          <p className="text-text-muted text-sm">Your payment has been confirmed and your balance updated.</p>
        </div>
        <Link
          href="/parents/parent-fees"
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md px-4 py-2 text-sm font-medium"
        >
          Back to Fees
        </Link>
      </div>
    );
  }

  if (isError || exhausted) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="bg-bg-basic-orange-subtle border-bg-basic-orange-accent flex size-14 items-center justify-center rounded-full border">
          <AlertFill fill="var(--color-icon-warning)" className="size-7" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-text-default text-base font-semibold">Payment is still processing</p>
          <p className="text-text-muted max-w-sm text-sm">
            We haven&apos;t received confirmation yet. If you completed the payment, your balance will update shortly — check back in a few minutes.
          </p>
        </div>
        <Link
          href="/parents/parent-fees"
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default rounded-md px-4 py-2 text-sm font-medium"
        >
          Back to Fees
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <Spinner className="size-12" />
      <p className="text-text-subtle text-sm">Verifying your payment…</p>
    </div>
  );
};
