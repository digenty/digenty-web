"use client";

import { PendingFeeItem } from "@/api/parent-fees";
import { feeStatusConfig } from "@/components/ParentPortalComponents/feeStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Close } from "@digenty/icons";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export const PendingFees = ({ fees, loading }: { fees?: PendingFeeItem[]; loading?: boolean }) => {
  const router = useRouter();

  return (
    <div>
      <div className="border-border-default rounded-lg border">
        <div className="bg-bg-subtle flex items-center justify-between rounded-t-lg p-4">
          <div className="text-text-default text-sm font-semibold">Pending Fees</div>
          <Button onClick={() => router.push("/parents/parent-fees")} className="text-text-informative hover:bg-bg-none! bg-none! p-0 font-medium">
            Pay Fees <ArrowRight />{" "}
          </Button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="bg-bg-input-soft h-14 w-full rounded-md" />
            <Skeleton className="bg-bg-input-soft h-14 w-full rounded-md" />
          </div>
        ) : !fees || fees.length === 0 ? (
          <div className="text-text-muted flex items-center justify-center p-6 text-sm">No pending fees</div>
        ) : (
          <div className="flex flex-col">
            {fees.map(fee => {
              const status = feeStatusConfig[fee.status];
              return (
                <div key={fee.studentFeeItemId} className="border-border-default flex items-center justify-between border-t p-3 md:p-5">
                  <div className="flex flex-col gap-1">
                    <div className="text-text-default text-sm font-medium">{fee.name}</div>
                    <div className="text-text-muted text-xs font-normal">₦{fee.amountPaid.toLocaleString()} already paid</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="text-text-default text-sm font-semibold">₦{fee.balance.toLocaleString()}</div>
                    <Badge className={`${status?.className ?? ""} border-border-default rounded-md border text-xs font-medium`}>
                      {status?.showIcon && <Close fill="var(--color-bg-basic-red-strong)" />}
                      {status?.label ?? fee.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
