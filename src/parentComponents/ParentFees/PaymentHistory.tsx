import { Receipt } from "@/components/Icons/Receipt";
import { Badge } from "@/components/ui/badge";
import React from "react";

export const PaymentHistory = () => {
  const paymentHistoryMock = [
    {
      id: 1,
      title: "Tuition",
      amount: 28000,
      date: "Jan 10, 2026",
      status: "Successful",
    },
    {
      id: 1,
      title: "Tuition",
      amount: 28000,
      date: "Jan 10, 2026",
      status: "Failed",
    },
  ];
  return (
    <div>
      <div className="border-border-default flex flex-col rounded-xl border">
        <div className="text-text-default flex items-center gap-3 p-4 text-sm font-semibold">
          <Receipt fill="var(--color-icon-default-muted)" /> Payment History
        </div>
        {paymentHistoryMock.map(history => (
          <div key={history.id} className="border-border-default flex flex-col gap-2 border-t p-4">
            <div className="flex items-center justify-between">
              <div className="text-text-default text-sm font-medium">{history.title}</div>
              <div className="text-text-default text-sm font-semibold">₦{history.amount.toLocaleString()}</div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-text-muted text-xs">{history.date}</div>
              <Badge
                className={`${history.status === "Successful" && "bg-bg-badge-green text-bg-basic-green-strong"} ${history.status === "Failed" && "bg-bg-badge-red text-bg-basic-red-strong"} border-border-default rounded-md border text-xs font-medium`}
              >
                {history.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
