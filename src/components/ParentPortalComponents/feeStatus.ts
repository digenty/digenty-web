import type { FeeStatus } from "@/api/parent-fees";

export const feeStatusConfig: Record<FeeStatus, { label: string; className: string; showIcon?: boolean }> = {
  PAID: { label: "Paid", className: "bg-bg-badge-green text-bg-basic-green-strong" },
  PARTIALLY_PAID: { label: "Partially Paid", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  PENDING: { label: "Unpaid", className: "bg-bg-badge-red text-bg-basic-red-strong", showIcon: true },
  OVERDUE: { label: "Overdue", className: "bg-bg-badge-red text-bg-basic-red-strong", showIcon: true },
};
