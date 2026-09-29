"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AllInvoices } from "./AllInvoices";
import { PendingPayments } from "./PendingPayments";

const tabs = ["All Invoices", "Pending Payments"];

export const Invoices = () => {
  const router = useRouter();
  const params = useSearchParams();
  const activeTab = params.get("tab") ?? "All Invoices";

  return (
    <div className="space-y-4 px-4 pt-4 pb-8 md:px-8 md:pt-6 md:pb-12">
      <div className="border-border-default flex w-auto max-w-105 items-center gap-3 border-b">
        {tabs.map(tab => {
          const isActive = activeTab === tab;
          return (
            <div
              role="button"
              onClick={() => router.push(`/staff/invoices?tab=${tab}`)}
              key={tab}
              className={cn(
                "w-1/2 cursor-pointer py-2.5 text-center transition-all duration-150",
                isActive && "border-border-informative border-b-[1.5px]",
              )}
            >
              <span className={cn("text-sm font-medium", isActive ? "text-text-informative" : "text-text-muted")}>{tab}</span>
            </div>
          );
        })}
      </div>

      {activeTab === "All Invoices" && <AllInvoices />}
      {activeTab === "Pending Payments" && <PendingPayments />}
    </div>
  );
};
