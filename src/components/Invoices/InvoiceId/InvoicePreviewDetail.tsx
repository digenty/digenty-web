"use client";

import Image from "next/image";
import { CheckIcon, X } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageEmptyState } from "@/components/Error/PageEmptyState";
import { InvoicePreviewResponse } from "@/api/invoice";
import { useGetInvoicePreview } from "@/hooks/queryHooks/useInvoice";
import { useParams } from "next/navigation";

const fmt = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

const fmtMoney = (n?: number, currency = "NGN") =>
  n != null ? `${currency} ${n.toLocaleString()}` : "—";

const METHOD_LABELS: Record<string, string> = {
  BANK_TRANSFER_TERMINAL: "Bank Transfer",
  CASH: "Cash",
  POS: "POS",
  OTHER_BANK_TRANSFER: "Bank Transfer",
};

const StatusBadge = ({ status }: { status: string }) => {
  if (status === "PAID")
    return (
      <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default rounded-md text-xs font-medium">
        <CheckIcon className="size-3" /> Paid
      </Badge>
    );
  if (status === "PARTIALLY_PAID")
    return (
      <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default rounded-md text-xs font-medium">
        Partially Paid
      </Badge>
    );
  return (
    <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default rounded-md text-xs font-medium">
      <X className="size-3" /> Unpaid
    </Badge>
  );
};

const PreviewSkeleton = () => (
  <div className="mx-auto max-w-2xl space-y-6 p-6">
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="bg-bg-input-soft size-12 rounded-full" />
        <Skeleton className="bg-bg-input-soft h-5 w-32" />
      </div>
      <Skeleton className="bg-bg-input-soft h-7 w-20" />
    </div>
    {/* Meta grid */}
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="bg-bg-input-soft h-3 w-16" />
          <Skeleton className="bg-bg-input-soft h-5 w-24" />
        </div>
      ))}
    </div>
    {/* Bill to */}
    <div className="space-y-2">
      <Skeleton className="bg-bg-input-soft h-4 w-14" />
      <Skeleton className="bg-bg-input-soft h-8 w-48" />
    </div>
    {/* Table header */}
    <Skeleton className="bg-bg-input-soft h-8 w-full" />
    {/* Table rows */}
    {Array.from({ length: 3 }).map((_, i) => (
      <Skeleton key={i} className="bg-bg-input-soft h-10 w-full" />
    ))}
    {/* Totals */}
    <div className="flex flex-col items-end gap-2">
      <Skeleton className="bg-bg-input-soft h-4 w-40" />
      <Skeleton className="bg-bg-input-soft h-4 w-40" />
      <Skeleton className="bg-bg-input-soft h-5 w-44" />
    </div>
    {/* Payment history */}
    <Skeleton className="bg-bg-input-soft h-4 w-36" />
    <Skeleton className="bg-bg-input-soft h-24 w-full" />
  </div>
);

const InvoicePreviewContent = ({ inv }: { inv: InvoicePreviewResponse }) => {
  const currency = inv.school.currency;
  const firstBillTo = inv.billTo[0];

  return (
    <div className="mx-auto max-w-2xl">
      <div className="bg-bg-subtle border-border-default rounded-sm border p-1.5">
        <div className="bg-bg-default border-border-default flex flex-col gap-6 rounded-sm border p-5">
          {/* School header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {inv.school.logo ? (
                <Image src={inv.school.logo} alt="School logo" width={40} height={40} className="size-10 rounded-full object-cover" />
              ) : (
                <Avatar className="size-10" />
              )}
              <div>
                <div className="text-text-default text-sm font-semibold">{inv.school.name}</div>
                {inv.branch.address && <div className="text-text-muted text-xs">{inv.branch.address}</div>}
              </div>
            </div>
            <div className="text-text-default text-xl font-semibold">INVOICE</div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <div className="text-text-muted text-xs">Invoice No.</div>
              <div className="text-text-default text-sm font-medium">{inv.invoiceNumber}</div>
            </div>
            <div>
              <div className="text-text-muted text-xs">Status</div>
              <StatusBadge status={inv.status} />
            </div>
            <div>
              <div className="text-text-muted text-xs">Issued Date</div>
              <div className="text-text-default text-sm font-medium">{fmt(inv.issuedDate)}</div>
            </div>
            <div>
              <div className="text-text-muted text-xs">Due Date</div>
              <div className="text-text-default text-sm font-medium">{fmt(inv.dueDate)}</div>
            </div>
          </div>

          {/* Bill to + Term */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-text-muted mb-1 text-xs">Bill To</div>
              {firstBillTo ? (
                <div className="flex items-center gap-1.5">
                  <Avatar className="size-5" url={firstBillTo.avatar ?? undefined} />
                  <div>
                    <div className="text-text-default text-sm font-medium">{firstBillTo.name}</div>
                    <div className="text-text-muted text-xs">{firstBillTo.classLabel}</div>
                  </div>
                </div>
              ) : (
                <span className="text-text-muted text-sm">—</span>
              )}
            </div>
            <div className="text-right">
              <div className="text-text-muted text-xs">Term</div>
              <div className="text-text-default text-sm font-medium">{inv.termName}</div>
            </div>
          </div>

          {/* Items table */}
          <div>
            <div className="bg-bg-input-soft grid grid-cols-12 rounded-t-sm px-3 py-2 text-xs font-medium">
              <span className="col-span-5 text-text-default">Item</span>
              <span className="col-span-2 text-center text-text-default">Qty</span>
              <span className="col-span-2 text-right text-text-default">Price</span>
              <span className="col-span-2 text-right text-text-default">Total</span>
              <span className="col-span-1 text-right text-text-default">Type</span>
            </div>
            {inv.items.map(item => (
              <div key={item.id} className="border-border-default grid grid-cols-12 border-b px-3 py-2.5 text-sm last:border-b-0">
                <span className="col-span-5 text-text-default font-medium">{item.name}</span>
                <span className="col-span-2 text-center text-text-subtle">{item.quantity}</span>
                <span className="col-span-2 text-right text-text-subtle">{fmtMoney(item.price, currency)}</span>
                <span className="col-span-2 text-right text-text-default font-medium">{fmtMoney(item.total, currency)}</span>
                <span className={`col-span-1 text-right text-xs font-medium ${item.required ? "text-text-informative" : "text-text-muted"}`}>
                  {item.required ? "Req" : "Opt"}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex flex-col items-end gap-1.5 text-sm">
            <div className="flex w-48 justify-between">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text-default font-medium">{fmtMoney(inv.subtotal, currency)}</span>
            </div>
            <div className="flex w-48 justify-between">
              <span className="text-text-muted">Total Paid</span>
              <span className="text-text-default font-medium">{fmtMoney(inv.totalPaid, currency)}</span>
            </div>
            <div className="border-border-default flex w-48 justify-between border-t pt-1.5">
              <span className="text-text-default font-semibold">Outstanding</span>
              <span className="text-text-default font-semibold">{fmtMoney(inv.outstandingBalance, currency)}</span>
            </div>
          </div>

          {/* Payment history */}
          {inv.payments.length > 0 && (
            <div>
              <div className="text-text-default mb-2 text-sm font-semibold">Payment History</div>
              <div className="border-border-default overflow-hidden rounded-sm border">
                <div className="bg-bg-input-soft grid grid-cols-12 px-3 py-2 text-xs font-medium text-text-default">
                  <span className="col-span-3">Date</span>
                  <span className="col-span-3">Method</span>
                  <span className="col-span-3 text-right">Amount</span>
                  <span className="col-span-3 text-right">Status</span>
                </div>
                {inv.payments.map(p => (
                  <div key={p.id} className="border-border-default grid grid-cols-12 border-t px-3 py-2 text-sm">
                    <span className="col-span-3 text-text-subtle">{fmt(p.date)}</span>
                    <span className="col-span-3 text-text-subtle">{METHOD_LABELS[p.method] ?? p.method}</span>
                    <span className="col-span-3 text-right text-text-default font-medium">{fmtMoney(p.amount, currency)}</span>
                    <span className="col-span-3 text-right">
                      <Badge className={`rounded-md text-xs font-medium ${p.status === "SUCCESSFUL" ? "bg-bg-badge-green text-bg-basic-green-strong" : "bg-bg-badge-red text-bg-basic-red-strong"} border-border-default`}>
                        {p.status === "SUCCESSFUL" ? "Successful" : p.status}
                      </Badge>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          {inv.note && (
            <div>
              <div className="text-text-default mb-1.5 text-sm font-semibold">Note</div>
              <div className="bg-bg-muted text-text-default rounded-sm p-4 text-sm">{inv.note}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const InvoicePreviewDetail = () => {
  const params = useParams();
  const invoiceId = params.id as string;

  const { data, isPending, isError } = useGetInvoicePreview(invoiceId);
  const inv = (data as { data: InvoicePreviewResponse } | undefined)?.data;

  if (isPending) return <PreviewSkeleton />;

  if (isError || !inv)
    return (
      <PageEmptyState
        title="Failed to load preview"
        description="We couldn't load this invoice preview. Please try again."
        buttonText="Back to Invoices"
        url="/staff/invoices"
      />
    );

  return (
    <div className="px-4 py-6 md:px-8">
      <InvoicePreviewContent inv={inv} />
    </div>
  );
};
