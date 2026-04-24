"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Info, AlertTriangle, CreditCardIcon } from "lucide-react";

interface OrderSummaryProps {
  planName: string;
  studentCount: number;
  billingCycle: string;
  subtotal: number;
  onPay: () => void;
}

export const OrderSummary = ({ planName, studentCount, billingCycle, subtotal, onPay }: OrderSummaryProps) => {
  return (
    <div className="border-border-default flex h-fit flex-col rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="text-text-default mb-6 text-sm font-bold tracking-wider uppercase">Order Summary</h3>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-subtle font-medium">Plan</span>
          <span className="text-text-default font-bold">{planName}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-subtle font-medium">Students</span>
          <span className="text-text-default font-bold">{studentCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-subtle font-medium">Billing</span>
          <span className="text-text-default font-bold">{billingCycle}</span>
        </div>
      </div>

      <div className="my-4 border-t border-zinc-100"></div>

      <div className="mb-6 flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-subtle font-medium">Subtotal</span>
          <span className="text-text-default font-bold">₦{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-default font-bold">Total Cost</span>
          <span className="text-text-default font-extrabold">₦{subtotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCardIcon className="h-4 w-4 text-zinc-400" />
            <span className="text-text-default text-xs font-bold">Use Referral Earnings</span>
          </div>
          <Switch />
        </div>
        <div className="bg-bg-badge-green rounded-md border-none p-3">
          <span className="text-text-success text-xs font-bold">Referral Balance (₦1,104)</span>
        </div>
      </div>

      <div className="mb-6 flex gap-3 rounded-md border-none bg-zinc-50 p-4">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 text-zinc-900" />
        <p className="text-text-subtle text-[11px] leading-relaxed font-medium">
          You&apos;ll be redirected to a secure payment gateway to complete this transaction. Your subscription begins once payment is confirmed.
        </p>
      </div>

      <Button
        onClick={onPay}
        className="bg-bg-state-primary hover:bg-bg-state-primary-hover flex w-full items-center justify-center gap-2 rounded-md py-3 text-sm font-bold text-white"
      >
        <CreditCardIcon className="h-4 w-4" />
        Pay ₦{subtotal.toLocaleString()}
      </Button>
    </div>
  );
};
