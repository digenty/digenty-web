"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useVerifySubscription } from "@/hooks/queryHooks/useSubscription";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export const SubscriptionVerify = () => {
  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Subscriptions", url: "/staff/settings/subscription" },
    { label: "Verify Payment", url: "/staff/settings/subscription/verify" },
  ]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? "";

  useEffect(() => {
    if (!reference) {
      router.replace("/staff/settings/subscription");
    }
  }, [reference, router]);

  const { isLoading, isSuccess, isError, error } = useVerifySubscription(reference);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Subscription activated successfully");
      router.replace("/staff/settings/subscription");
    }
  }, [isSuccess, router]);

  if (!reference || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <div className="bg-bg-state-soft h-10 w-10 animate-pulse rounded-full" />
        <p className="text-text-subtle text-sm">Verifying your payment…</p>
      </div>
    );
  }

  if (isError) {
    const message =
      error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : "Payment verification failed.";
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-text-default text-sm font-medium">{message}</p>
        <p className="text-text-muted text-xs">Your payment could not be confirmed. Please try again or contact support.</p>
        <Link
          href="/staff/settings/subscription/plans"
          className="bg-bg-state-primary text-text-white-default rounded-md px-4 py-2 text-sm font-medium"
        >
          Back to Plans
        </Link>
      </div>
    );
  }

  return null;
};
