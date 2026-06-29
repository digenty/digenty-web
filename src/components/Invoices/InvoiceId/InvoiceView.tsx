"use client";
import { Avatar } from "@/components/Avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getBadge } from "@/components/StudentAndParent/Students/StudentProfile/StudentInvoiceTable";
import { formatInvoiceStatus } from "@/components/Invoices/types";
import { InvoiceDetailResponse } from "./invoiceIdTypes";

type InvoiceViewProps = {
  invoice?: InvoiceDetailResponse;
  loading: boolean;
};

const formatDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString() : "-");

export const InvoiceView = ({ invoice, loading }: InvoiceViewProps) => {
  if (loading) {
    return <Skeleton className="bg-bg-input-soft h-52 w-full" />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      <div className="border-border-default rounded-tl-1 flex h-26 flex-col justify-center gap-4 border border-b-0 p-4 md:border-b md:p-8">
        <div className="text-text-muted text-xs font-medium">Status</div>
        <p className="text-text-default text-md font-medium">
          {invoice?.status ? getBadge(formatInvoiceStatus(invoice.status)) : <span className="text-text-muted text-sm">None</span>}
        </p>
      </div>

      <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-b-0 border-l-0 p-4 md:border-b md:p-8">
        <div className="text-text-muted text-xs font-medium">Issued Date</div>
        <p className="text-text-default text-md font-medium">{formatDate(invoice?.issuedDate)}</p>
      </div>

      <div className="border-border-default flex h-26 flex-col gap-4 border p-4 md:border-l-0 md:p-8">
        <div className="text-text-muted text-xs font-medium">Due Date</div>
        <p className="text-text-default text-md font-medium">{formatDate(invoice?.dueDate)}</p>
      </div>

      <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-l-0 p-4 md:p-8">
        <div className="text-text-muted text-xs font-medium">Issued To</div>
        <p className="text-text-default text-md flex items-center gap-1 text-sm font-medium">
          <Avatar className="size-5" url={invoice?.issueTo?.avatar} />
          {invoice?.issueTo?.name ?? "-"}
        </p>
      </div>

      <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-t-0 p-4 md:p-8">
        <div className="text-text-muted text-xs font-medium">Term & Session</div>
        <p className="text-text-default text-md font-medium">{invoice?.termName ?? "-"}</p>
      </div>

      <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-t-0 border-l-0 p-4 md:p-8">
        <div className="text-text-muted text-xs font-medium">Branch</div>
        <p className="text-text-default text-md font-medium">{invoice?.branchName ?? "-"}</p>
      </div>

      <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-t-0 p-4 md:border-l-0 md:p-8">
        <div className="text-text-muted text-xs font-medium">Last Updated</div>
        <p className="text-text-default text-md font-medium">{formatDate(invoice?.lastUpdated)}</p>
      </div>

      <div className="border-border-default flex h-26 flex-col justify-center gap-4 border border-t-0 border-l-0 p-4 md:p-8">
        <div className="text-text-muted text-xs font-medium">Last Updated By</div>
        <p className="text-text-default text-md flex items-center gap-1 text-sm font-medium">
          <Avatar className="size-5" url={invoice?.lastUpdatedBy?.avatar} />
          {invoice?.lastUpdatedBy?.name ?? "-"}
        </p>
      </div>
    </div>
  );
};
