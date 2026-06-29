"use client";
import { AddFill } from "@digenty/icons";
import React from "react";
import { DashProgress } from "@/components/ProgressBar/DashProgress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { formatNaira } from "@/components/Invoices/types";

type InvoicePaymentSummaryProps = {
  invoiceId?: number;
  totalAmount?: number;
  totalPaid?: number;
  outstandingBalance?: number;
  paymentProgress?: number;
  loading: boolean;
};

export const InvoicePaymentSummary = ({
  invoiceId,
  totalAmount,
  totalPaid,
  outstandingBalance,
  paymentProgress = 0,
  loading,
}: InvoicePaymentSummaryProps) => {
  const router = useRouter();

  if (loading) {
    return <Skeleton className="bg-bg-input-soft h-80 w-full lg:w-1/4" />;
  }

  return (
    <div className="border-border-default flex w-full flex-col border p-6 lg:w-1/4">
      <div>
        <div className="text-text-default text-md mb-5 font-semibold">Payment Summary</div>

        <div className="mb-2 flex justify-between">
          <div className="text-text-default text-sm font-medium">Payment Progress</div>
          <div className="text-text-muted font-normal">{paymentProgress}%</div>
        </div>
        <DashProgress value={paymentProgress} steps={10} />
      </div>

      <div className="border-border-default mt-12 mb-5 flex justify-between border-b pb-2">
        <div className="text-text-subtle text-sm font-normal">Total Amount</div>
        <div className="text-text-default text-sm font-normal">{formatNaira(totalAmount)}</div>
      </div>
      <div className="flex justify-between">
        <div className="text-text-subtle text-sm font-normal">Total Paid</div>
        <div className="text-text-success text-sm font-normal">{formatNaira(totalPaid)}</div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="text-text-subtle text-sm font-normal">Outstanding Balance</div>
        <div className="text-text-destructive text-sm font-normal">{formatNaira(outstandingBalance)}</div>
      </div>

      <div className="mt-10">
        <Button
          onClick={() => router.push(`/staff/invoices/add-payment?invoiceId=${invoiceId}`)}
          className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default mt-6 flex w-full items-center gap-1.5"
        >
          <AddFill fill="var(--color-icon-white-default)" />
          Add Payment
        </Button>
      </div>
    </div>
  );
};
