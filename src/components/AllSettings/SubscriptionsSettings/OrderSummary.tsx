"use client";

import { Button } from "@/components/ui/button";
import BankCard from "@/components/Icons/BankCard";
import { Alert } from "@/components/Icons/Alert";
import { BillingCycle } from "./type";
import { Toggle } from "@/components/Toggle";

interface OrderSummaryProps {
  planName: string;
  studentCount: number;
  billingCycle: BillingCycle;
  subtotal: number;
  useReferral: boolean;
  onToggleReferral: (v: boolean) => void;
  referralBalance: number;
  onPay: () => void;
  isPending?: boolean;
  disabled?: boolean;
}

export const OrderSummary = ({
  planName,
  studentCount,
  billingCycle,
  subtotal,
  useReferral,
  onToggleReferral,
  referralBalance,
  onPay,
  isPending,
  disabled,
}: OrderSummaryProps) => {
  const billingLabel = billingCycle === "Termly" ? "Monthly" : "Yearly";
  const totalCost = useReferral ? Math.max(0, subtotal - referralBalance) : subtotal;

  return (
    <div className="bg-bg-default border-border-default flex h-fit flex-col gap-6 rounded-xl border p-4 sm:p-6">
      <h3 className="text-text-default text-sm font-semibold tracking-wide uppercase">Order Summary</h3>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-subtle">Plan</span>
          <span className="text-text-default font-medium">{planName} Plan</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-subtle">Students</span>
          <span className="text-text-default font-medium">{studentCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-subtle">Billing</span>
          <span className="text-text-default font-medium">{billingLabel}</span>
        </div>
      </div>

      <div className="border-border-default border-t" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-subtle">Subtotal</span>
          <span className="text-text-default font-medium">₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-default font-semibold">Total Cost</span>
          <span className="text-text-default font-semibold">₦{totalCost.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BankCard fill="var(--color-icon-default-muted)" className="h-4 w-4" />
            <span className="text-text-default text-xs font-medium">Use Referral Earnings</span>
          </div>
          <Toggle withBorder={false} checked={useReferral} onChange={e => onToggleReferral(e.target.checked)} />
        </div>
        <div className="bg-bg-badge-green text-bg-basic-green-strong rounded-md px-3 py-2 text-sm font-medium">
          Referral Balance (₦{referralBalance.toLocaleString()})
        </div>
      </div>

      <div className="bg-bg-subtle flex gap-3 rounded-md p-3">
        <Alert fill="var(--color-icon-default-subtle)" className="mt-0.5 h-4 w-4 shrink-0" />
        <p className="text-text-subtle text-xs leading-relaxed">
          You&apos;ll be redirected to a secure payment gateway to complete this transaction. Your subscription begins once payment is confirmed.
        </p>
      </div>

      <Button
        onClick={onPay}
        disabled={disabled || isPending}
        className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-10 w-full rounded-md text-sm font-medium"
      >
        <BankCard fill="var(--color-icon-white-default)" className="h-4 w-4" />
        {isPending ? "Processing..." : `Pay ₦${totalCost.toLocaleString()}`}
      </Button>
    </div>
  );
};
