"use client";
import { DeleteBin, Edit, Printer } from "@digenty/icons";
import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useRouter } from "next/navigation";
import { useDeleteInvoice, useDownloadInvoicePdf } from "@/hooks/queryHooks/useInvoice";
import { toast } from "@/components/Toast";

type InvoiceIdHeaderProps = {
  invoiceNumber?: string;
  invoiceId?: number;
  urlInvoiceId?: string;
  loading: boolean;
};

export const InvoiceIdHeader = ({ invoiceNumber, invoiceId, urlInvoiceId, loading }: InvoiceIdHeaderProps) => {
  const router = useRouter();
  const { mutate: deleteInvoice, isPending: deleting } = useDeleteInvoice();
  const { mutate: downloadPdf, isPending: downloadingPdf } = useDownloadInvoicePdf();

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

  const handleDownloadPdf = () => {
    if (!urlInvoiceId) return;
    downloadPdf(urlInvoiceId, {
      onSuccess: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${invoiceNumber ?? "invoice"}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      onError: () => toast({ title: "Failed to download PDF", type: "error" }),
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
              onClick={() => router.push(`/staff/invoices/edit-invoice?id=${invoiceId}`)}
              className="bg-bg-state-secondary border-border-darker text-text-default hover:bg-bg-state-secondary-hover! flex h-8 w-30.5 items-center gap-1 border"
            >
              <Edit fill="var(--color-icon-default-muted)" />
              Edit Invoice
            </Button>
            <Button
              onClick={handleDownloadPdf}
              disabled={downloadingPdf || !urlInvoiceId}
              className="border-border-darker bg-bg-state-secondary text-text-default hover:bg-bg-state-secondary-hover! flex h-8 w-19 items-center gap-1 border disabled:opacity-60"
            >
              {downloadingPdf ? <Spinner className="size-4" /> : <Printer fill="var(--color-icon-default-muted)" />}
              {downloadingPdf ? "..." : "Print"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
