"use client";
import { DeleteBin, Edit, Printer } from "@digenty/icons";
import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import { useDeleteInvoice } from "@/hooks/queryHooks/useInvoice";
import { toast } from "@/components/Toast";

type InvoiceIdHeaderProps = {
  invoiceNumber?: string;
  invoiceId?: number;
  loading: boolean;
};

export const InvoiceIdHeader = ({ invoiceNumber, invoiceId, loading }: InvoiceIdHeaderProps) => {
  const router = useRouter();
  const { mutate: deleteInvoice, isPending: deleting } = useDeleteInvoice();

  useBreadcrumb([
    { label: "Invoices", url: "/staff/invoices" },
    { label: "Invoice Details", url: "" },
  ]);

  const handleDelete = () => {
    if (!invoiceId) return;
    deleteInvoice(String(invoiceId), {
      onSuccess: () => {
        toast({ title: "Invoice deleted", type: "success" });
        router.push("/staff/invoices");
      },
      onError: () => toast({ title: "Failed to delete invoice", type: "error" }),
    });
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row md:justify-between">
      {loading || !invoiceNumber ? (
        <Skeleton className="bg-bg-input-soft h-7 w-48" />
      ) : (
        <div className="text-text-default text-lg font-semibold">{invoiceNumber}</div>
      )}

      <div className="flex items-center gap-1">
        {loading || !invoiceId ? (
          <>
            <Skeleton className="bg-bg-input-soft h-8 w-22" />
            <Skeleton className="bg-bg-input-soft h-8 w-30.5" />
            <Skeleton className="bg-bg-input-soft h-8 w-19" />
          </>
        ) : (
          <>
            <Button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover! flex h-8 w-22! items-center gap-1 px-2.5! py-1.5!"
            >
              {deleting ? <Spinner className="text-text-white-default size-4" /> : <DeleteBin fill="var(--color-icon-white-default)" />}
              {deleting ? "Deleting..." : "Delete"}
            </Button>
            <Button
              role="button"
              onClick={() => router.push(`/staff/invoices/edit-invoice?id=${invoiceId}`)}
              className="bg-bg-state-secondary border-border-darker text-text-default hover:bg-bg-state-secondary-hover! flex h-8 w-30.5 items-center gap-1 border"
            >
              <Edit fill="var(--color-icon-default-muted)" />
              Edit Invoice
            </Button>
            <Button className="border-border-darker bg-bg-state-secondary text-text-default hover:bg-bg-state-secondary-hover! flex h-8 w-19 items-center gap-1 border">
              <Printer fill="var(--color-icon-default-muted)" /> Print
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
