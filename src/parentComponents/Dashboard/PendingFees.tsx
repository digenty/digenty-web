"use client";

import { Close } from "@/components/Icons/Close";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const mockData = [
  {
    id: 1,
    title: "Tuition Fee",
    detail: "₦20,000 already paid",
    amount: 120000,
    status: "Unpaid",
  },
  {
    id: 2,
    title: "Tuition Fee",
    amount: 120000,
    status: "Unpaid",
    detail: "₦20,000 already paid",
  },
];

export const PendingFees = () => {
  const router = useRouter();

  return (
    <div>
      <div className="border-border-default rounded-lg border">
        <div className="bg-bg-subtle flex items-center justify-between rounded-t-lg p-4">
          <div className="text-text-default text-sm font-semibold">Pending Fees</div>
          <Button
            onClick={() => router.push("/parent-fees/fees-to-pay")}
            className="text-text-informative hover:bg-bg-none! bg-none! p-0 font-medium"
          >
            Pay Fees <ArrowRight />{" "}
          </Button>
        </div>
        <div className="flex flex-col">
          {mockData.map(fee => (
            <div key={fee.id} className="border-border-default flex items-center justify-between border-t p-3 md:p-5">
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-sm font-medium">{fee.title}</div>
                <div className="text-text-muted text-xs font-normal">{fee.detail}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-sm font-semibold">{fee.amount.toLocaleString()}</div>
                <Badge
                  className={`${fee.status === "Unpaid" && "text-bg-basic-red-strong bg-bg-badge-red"} border-border-default rounded-md border text-xs font-medium`}
                >
                  {fee.status === "Unpaid" && <Close fill="var(--color-bg-basic-red-strong)" />}
                  {fee.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
