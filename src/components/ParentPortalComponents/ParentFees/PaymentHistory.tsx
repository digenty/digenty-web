"use client";

import { useState } from "react";
import { Bill, QuickReferenceAll } from "@digenty/icons";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/DataTable/Pagination";
import { useGetParentPaymentHistory } from "@/hooks/queryHooks/useParentFees";
import { useStudentFilterStore } from "@/store/parent";
import { PaymentHistoryMethod, PaymentHistoryStatus } from "@/api/parent-fees";
import { formatDate } from "@/lib/utils";

const PAGE_SIZE = 10;

const statusConfig: Record<PaymentHistoryStatus, { label: string; className: string }> = {
  SUCCESSFUL: { label: "Successful", className: "bg-bg-badge-green text-bg-basic-green-strong" },
  APPROVED: { label: "Approved", className: "bg-bg-badge-green text-bg-basic-green-strong" },
  PENDING_REVIEW: { label: "Pending Review", className: "bg-bg-badge-orange text-bg-basic-orange-strong" },
  REJECTED: { label: "Rejected", className: "bg-bg-badge-red text-bg-basic-red-strong" },
  FAILED: { label: "Failed", className: "bg-bg-badge-red text-bg-basic-red-strong" },
};

const methodLabels: Record<PaymentHistoryMethod, string> = {
  ONLINE: "Online Payment",
  BANK_TRANSFER: "Bank Transfer",
  CASH: "Cash",
  POS: "POS",
  CHEQUE: "Cheque",
};

const EmptyState = () => (
  <div className="border-border-default flex flex-col items-center gap-2 border-t p-10 text-center">
    <QuickReferenceAll fill="var(--color-icon-default-muted)" />
    <p className="text-text-default text-sm font-medium">No payment history yet</p>
    <p className="text-text-muted text-xs">Payments you make for this student will show up here.</p>
  </div>
);

export const PaymentHistory = ({ termId }: { termId?: number }) => {
  const { selectedStudentId } = useStudentFilterStore();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetParentPaymentHistory(selectedStudentId, termId, page - 1, PAGE_SIZE);
  const entries = data?.content ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.totalElements ?? 0) / PAGE_SIZE));

  return (
    <div>
      <div className="border-border-default flex flex-col rounded-xl border">
        <div className="text-text-default flex items-center gap-3 p-4 text-sm font-semibold">
          <Bill fill="var(--color-icon-default-muted)" /> Payment History
        </div>

        {isLoading && (
          <div className="border-border-default flex flex-col gap-2 border-t p-4">
            <Skeleton className="bg-bg-input-soft h-14 w-full rounded-md" />
            <Skeleton className="bg-bg-input-soft h-14 w-full rounded-md" />
            <Skeleton className="bg-bg-input-soft h-14 w-full rounded-md" />
          </div>
        )}

        {!isLoading && (isError || entries.length === 0) && <EmptyState />}

        {!isLoading && !isError && entries.length > 0 && (
          <div className="border-border-default divide-border-default flex flex-col divide-y border-t">
            {entries.map(entry => {
              const status = statusConfig[entry.status];
              return (
                <div key={entry.id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-text-default text-sm font-medium">₦{entry.amount.toLocaleString()}</span>
                    <Badge className={`${status?.className ?? ""} rounded-md text-xs font-medium`}>{status?.label ?? entry.status}</Badge>
                  </div>
                  <div className="text-text-muted flex flex-wrap items-center gap-x-2 text-xs">
                    <span>{formatDate(entry.date)}</span>
                    <span>·</span>
                    <span>{methodLabels[entry.method] ?? entry.method}</span>
                    <span>·</span>
                    <span>{entry.invoiceNumber}</span>
                  </div>
                  <div className="text-text-muted text-xs">{entry.feeItems.map(item => item.name).join(", ")}</div>
                  {entry.status === "REJECTED" && entry.note && <div className="text-text-destructive text-xs">{entry.note}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!isLoading && !isError && entries.length > 0 && totalPages > 1 && (
        <div className="pt-4">
          <Pagination currentPage={page} totalPages={totalPages} setCurrentPage={setPage} />
        </div>
      )}
    </div>
  );
};
