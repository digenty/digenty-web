import React from "react";
import { DashProgress } from "../ProgressBar/DashProgress";
import { Button } from "../ui/button";
import { AddFill } from "../Icons/AddFill";

export const InvoicePaymentSummary = () => {
  const progress = 60;
  return (
    <div className="border-border-default flex w-full flex-col border p-6 lg:max-w-90">
      <div>
        <div className="text-text-default text-md mb-5 font-semibold">Payment Summary</div>

        <div className="mb-2 flex justify-between">
          <div className="text-text-default text-sm font-medium">Payment Progress</div>
          <div className="text-text-muted"> {progress}%</div>
        </div>
        <DashProgress value={progress} steps={10} />
      </div>

      <div className="border-border-default mt-12 mb-5 flex justify-between border-b pb-2">
        <div className="text-text-subtle text-sm font-normal">Total Amount</div>
        <div className="text-text-default text-sm font-normal">₦50,000</div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="text-text-subtle text-sm font-normal">Total Paid</div>
        <div className="text-text-success text-sm font-normal">₦50,000</div>
      </div>
      <div className="mt-4 flex justify-between">
        <div className="text-text-subtle text-sm font-normal">Outstanding Balance</div>
        <div className="text-text-destructive text-sm font-normal">₦50,000</div>
      </div>

      <div className="mt-10">
        <Button className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default mt-6 flex w-full items-center gap-1.5">
          <AddFill fill="var(--color-icon-white-default)" />
          Add Payment
        </Button>
      </div>
    </div>
  );
};
