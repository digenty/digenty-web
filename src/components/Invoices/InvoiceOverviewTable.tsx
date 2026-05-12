"use client";

import { BallPen, Eye, Notification2, Printer } from "@digenty/icons";
import { MoreHorizontalIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "../Avatar";
import { DataTable } from "../DataTable";
import { MobileDrawer } from "../MobileDrawer";
import { getBadge } from "../StudentAndParent/Students/StudentProfile/StudentInvoiceTable";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { InvoiceOverviewTableColumns } from "./Column";
import { formatInvoiceStatus, formatNaira, InvoicesOverviewTableProps } from "./types";
import { toast } from "@/components/Toast";
import { useDeleteInvoice, useSendInvoiceReminder } from "@/hooks/queryHooks/useInvoice";

type InvoiceOverviewTableTableProps = {
  invoices: InvoicesOverviewTableProps[];
  loading: boolean;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  totalCount?: number;
};

export const InvoiceOverviewTable = ({ invoices, loading, page, setPage, pageSize, totalCount }: InvoiceOverviewTableTableProps) => {
  const [rowSelection, setRowSelection] = useState({});
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const [, setSelectedRows] = useState<InvoicesOverviewTableProps[]>([]);
  const router = useRouter();

  const { mutate: sendReminder, isPending: sendingReminder } = useSendInvoiceReminder();
  const { mutate: deleteInvoice, isPending: deletingInvoice } = useDeleteInvoice();

  const handleSendReminder = (id: string) => {
    sendReminder(id, {
      onSuccess: () => {
        toast({ title: "Reminder sent successfully", type: "success" });
        setSelectedInvoiceId(null);
      },
      onError: () => toast({ title: "Failed to send reminder", type: "error" }),
    });
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id, {
      onSuccess: () => {
        toast({ title: "Invoice deleted", type: "success" });
        setSelectedInvoiceId(null);
      },
      onError: () => toast({ title: "Failed to delete invoice", type: "error" }),
    });
  };

  return (
    <div>
      <div className="hidden md:block">
        {loading && invoices.length === 0 ? (
          <Skeleton className="bg-bg-input-soft h-100 w-full" />
        ) : (
          <DataTable
            columns={InvoiceOverviewTableColumns}
            data={invoices}
            totalCount={totalCount ?? invoices.length}
            page={page}
            setCurrentPage={setPage}
            pageSize={pageSize}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
            onSelectRows={setSelectedRows}
            clickHandler={row => router.push(`/staff/invoices/${row.original.invoiceId}`)}
            showPagination={true}
            loadingContent={loading}
          />
        )}
      </div>

      <div className="flex flex-col gap-4 md:hidden">
        {loading && invoices.length === 0 ? (
          <Skeleton className="bg-bg-input-soft h-80 w-full" />
        ) : (
          <>
            {invoices.slice(0, visibleCount).map(invoice => (
              <div key={invoice.invoiceId} className="border-border-default bg-bg-subtle rounded-md border">
                <div className="flex h-9.5 items-center justify-between px-3 py-1.5">
                  <span className="text-text-default text-sm font-medium">{invoice.invoiceNumber}</span>
                  <Button
                    onClick={() => setSelectedInvoiceId(invoice.invoiceId)}
                    className="text-text-muted bg-bg-none! cursor-pointer bg-transparent! p-0! focus-visible:ring-0!"
                  >
                    <MoreHorizontalIcon className="size-5" />
                  </Button>
                </div>

                <MobileDrawer open={selectedInvoiceId === invoice.invoiceId} setIsOpen={open => !open && setSelectedInvoiceId(null)} title="Actions">
                  <div className="flex w-full flex-col gap-4 px-3 py-4">
                    <div className="flex flex-col items-center gap-2">
                      <div
                        role="button"
                        onClick={() => router.push(`/staff/invoices/${invoice.invoiceId}`)}
                        className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                      >
                        <Eye className="size-4" fill="var(--color-icon-default-subtle)" /> View Invoice
                      </div>

                      <div
                        role="button"
                        onClick={() => router.push(`/staff/invoices/edit-invoice?id=${invoice.invoiceId}`)}
                        className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                      >
                        <BallPen fill="var(--color-icon-default-subtle)" className="size-4" /> Edit Invoice
                      </div>

                      <div
                        role="button"
                        onClick={() => router.push(`/staff/invoices/add-payment?invoiceId=${invoice.invoiceId}`)}
                        className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                      >
                        <BallPen fill="var(--color-icon-default-subtle)" className="size-4" />
                        <span>Record payment</span>
                      </div>

                      <div
                        role="button"
                        onClick={() => handleSendReminder(invoice.invoiceId)}
                        className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                      >
                        <Notification2 fill="var(--color-icon-default-subtle)" className="size-4" />
                        <span>{sendingReminder ? "Sending..." : "Send reminder"}</span>
                      </div>

                      <div
                        role="button"
                        onClick={() => handleDelete(invoice.invoiceId)}
                        className="hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600"
                      >
                        <Trash2 className="size-4" />
                        <span>{deletingInvoice ? "Deleting..." : "Delete invoice"}</span>
                      </div>
                    </div>
                  </div>
                </MobileDrawer>

                <div className="border-border-default border-t">
                  <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Student Name</span>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-5" url="" />
                      <span className="text-text-default text-sm font-medium">{invoice.studentName}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
                    <span className="text-text-muted font-medium">Amount</span>
                    <span className="text-text-default text-sm font-medium">{formatNaira(invoice.amount)}</span>
                  </div>
                </div>

                <div className="flex justify-between px-3 py-2 text-sm">
                  <span className="text-text-muted font-medium">Status</span>
                  {getBadge(formatInvoiceStatus(invoice.status))}
                </div>
              </div>
            ))}

            {visibleCount < invoices.length && (
              <Button
                onClick={() => setVisibleCount(invoices.length)}
                className="bg-bg-state-soft text-text-subtle mx-auto my-2 flex w-39 items-center justify-center rounded-md"
              >
                Load More
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
