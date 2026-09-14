"use client";

import { BallPen, Eye, Notification2, Printer, WarningIcon } from "@digenty/icons";
import { MoreHorizontalIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar } from "../Avatar";
import { DataTable } from "../DataTable";
import { MobileDrawer } from "../MobileDrawer";
import { Modal } from "../Modal";
import { getBadge } from "../StudentAndParent/Students/StudentProfile/StudentInvoiceTable";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { DialogDescription } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import { Spinner } from "../ui/spinner";
import { InvoiceOverviewTableColumns } from "./Column";
import { formatInvoiceStatus, formatNaira, InvoicesOverviewTableProps } from "./types";
import { toast } from "@/components/Toast";
import { useDeleteInvoice, useDeleteInvoices, useSendInvoiceReminder } from "@/hooks/queryHooks/useInvoice";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { canDeleteInvoices, canManageInvoices } from "@/lib/permissions/invoices";

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
  const [selectedRows, setSelectedRows] = useState<InvoicesOverviewTableProps[]>([]);
  const [openBulkDelete, setOpenBulkDelete] = useState(false);
  const [isBulkDeleteChecked, setIsBulkDeleteChecked] = useState(false);
  const router = useRouter();

  const { mutate: sendReminder, isPending: sendingReminder } = useSendInvoiceReminder();
  const { mutate: deleteInvoice, isPending: deletingInvoice } = useDeleteInvoice();
  const { mutate: deleteInvoices, isPending: deletingInvoices } = useDeleteInvoices();

  const handleSendReminder = (id: string) => {
    sendReminder(id, {
      onSuccess: () => {
        toast({ title: "Reminder sent successfully", type: "success" });
        setSelectedInvoiceId(null);
      },
      onError: (error: unknown) => {
        const description = error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : undefined;
        toast({ title: "Failed to send reminder", description, type: "error" });
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id, {
      onSuccess: () => {
        toast({ title: "Invoice deleted", type: "success" });
        setSelectedInvoiceId(null);
      },
      onError: (error: unknown) => {
        const description = error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : undefined;
        toast({ title: "Failed to delete invoice", description, type: "error" });
      },
    });
  };

  const closeBulkDelete = (open: boolean) => {
    setOpenBulkDelete(open);
    if (!open) setIsBulkDeleteChecked(false);
  };

  const handleBulkDelete = () => {
    const invoiceIds = selectedRows.map(row => row.invoiceId);
    deleteInvoices(invoiceIds, {
      onSuccess: result => {
        toast({
          title: result.failed.length > 0 ? `Deleted ${result.deleted} of ${result.requested} invoice(s)` : "Invoices deleted",
          description: result.failed.length > 0 ? "Some invoices could not be deleted. Please try again." : undefined,
          type: result.failed.length === 0 ? "success" : result.deleted === 0 ? "error" : "warning",
        });
        closeBulkDelete(false);
        setRowSelection({});
      },
      onError: (error: unknown) => {
        const description = error && typeof error === "object" && "message" in error ? String((error as { message: unknown }).message) : undefined;
        toast({ title: "Failed to delete invoices", description, type: "error" });
        closeBulkDelete(false);
      },
    });
  };

  return (
    <div>
      {selectedRows.length > 0 && (
        <div className="mb-4 hidden items-center gap-1 md:flex">
          <div className="bg-bg-state-soft text-text-default flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-sm font-medium">
            <span> {selectedRows.length}</span>
            <span>Selected Item{selectedRows.length !== 1 && "s"}</span>
          </div>

          <PermissionCheck permissionUtility={canDeleteInvoices}>
            <Button
              onClick={() => setOpenBulkDelete(true)}
              className="bg-bg-state-secondary border-border-darker text-text-default h-7 border px-2.5 text-sm font-medium"
            >
              <span>Delete Invoice{selectedRows.length !== 1 && "s"}</span>
            </Button>
          </PermissionCheck>
        </div>
      )}

      <Modal
        open={openBulkDelete}
        setOpen={closeBulkDelete}
        title="Delete Invoices?"
        className="block"
        ActionButton={
          <Button
            disabled={!isBulkDeleteChecked}
            onClick={handleBulkDelete}
            className={`h-7 rounded-md text-sm font-medium ${
              isBulkDeleteChecked
                ? "bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover!"
                : "bg-bg-state-soft text-text-subtle"
            }`}
          >
            {deletingInvoices && <Spinner className="text-text-white-default" />}
            Delete Invoice{selectedRows.length !== 1 && "s"}
          </Button>
        }
      >
        <div className="space-y-5 px-6 py-5">
          <DialogDescription className="text-text-subtle text-sm font-normal">
            You are about to permanently delete {selectedRows.length} invoice{selectedRows.length !== 1 && "s"}. This action cannot be undone.
          </DialogDescription>

          <div className="border-border-default max-h-40 space-y-2 overflow-y-auto rounded-md border p-3">
            {selectedRows.map(invoice => (
              <div key={invoice.invoiceId} className="flex items-center justify-between gap-2 text-sm">
                <span className="text-text-default font-medium">{invoice.invoiceNumber}</span>
                <span className="text-text-subtle">
                  {invoice.studentName} · {formatNaira(invoice.amount)}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle shadow-light flex items-center gap-3 rounded-sm border px-2.5 py-2.5 text-sm font-normal">
            <WarningIcon />
            <p>Deleting will remove these invoices and their payment records. This cannot be undone.</p>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="confirm-bulk-delete-invoices"
              checked={isBulkDeleteChecked}
              onCheckedChange={(checked: boolean) => setIsBulkDeleteChecked(checked)}
            />
            <label htmlFor="confirm-bulk-delete-invoices" className="text-text-subtle text-sm font-normal">
              I understand that deleting {selectedRows.length !== 1 ? "these invoices" : "this invoice"} is permanent and cannot be undone.
            </label>
          </div>
        </div>
      </Modal>

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

                      <PermissionCheck permissionUtility={canManageInvoices}>
                        <div
                          role="button"
                          onClick={() => router.push(`/staff/invoices/edit-invoice?id=${invoice.invoiceId}`)}
                          className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                        >
                          <BallPen fill="var(--color-icon-default-subtle)" className="size-4" /> Edit Invoice
                        </div>
                      </PermissionCheck>

                      <PermissionCheck permissionUtility={canManageInvoices}>
                        <div
                          role="button"
                          onClick={() => router.push(`/staff/invoices/add-payment?invoiceId=${invoice.invoiceId}`)}
                          className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                        >
                          <BallPen fill="var(--color-icon-default-subtle)" className="size-4" />
                          <span>Record payment</span>
                        </div>
                      </PermissionCheck>

                      <div
                        role="button"
                        onClick={() => handleSendReminder(invoice.invoiceId)}
                        className="text-text-default hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm"
                      >
                        <Notification2 fill="var(--color-icon-default-subtle)" className="size-4" />
                        <span>{sendingReminder ? "Sending..." : "Send reminder"}</span>
                      </div>

                      <PermissionCheck permissionUtility={canDeleteInvoices}>
                        <div
                          role="button"
                          onClick={() => handleDelete(invoice.invoiceId)}
                          className="hover:bg-bg-muted border-border-darker flex h-8 w-full items-center justify-center gap-2 rounded-md border p-2 text-sm text-red-600"
                        >
                          <Trash2 className="size-4" />
                          <span>{deletingInvoice ? "Deleting..." : "Delete invoice"}</span>
                        </div>
                      </PermissionCheck>
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
