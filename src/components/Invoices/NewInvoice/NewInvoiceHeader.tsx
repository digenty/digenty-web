import React from "react";
import { Button } from "../../ui/button";
import Eye from "../../Icons/Eye";
import Save from "../../Icons/Save";
import { SendPlane } from "../../Icons/SendPlane";
import { EyeClose } from "../../Icons/EyeClose";
import { INVOICE_STEPS, useInvoiceStep } from "./step";
import { Badge } from "../../ui/badge";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

type PreviewProps = {
  openPreview: boolean;
  onPreviewToggle: (open: boolean) => void;
};

export const NewInvoiceHeader = ({ openPreview, onPreviewToggle }: PreviewProps) => {
  const { step } = useInvoiceStep();
  const stepIndex = INVOICE_STEPS.findIndex(s => s.key === step);

  const current = stepIndex + 1;
  const total = INVOICE_STEPS.length;

  useBreadcrumb([
    { label: "Invoices", url: "/invoices" },
    { label: "New Invoice", url: "" },
  ]);

  return (
    <div className="mb-3">
      <div className="bg-bg-card-subtle border-border-default flex justify-between gap-3 border-b px-4 py-3 md:flex-row md:px-8">
        <div className="text-text-default text-xl font-semibold">New Invoice</div>

        <Badge className="text-text-subtle bg-bg-badge-default block h-6 rounded-sm p-1 md:hidden">
          {current}/{total}
        </Badge>
        <div className="hidden gap-1 md:flex md:justify-between">
          <Button
            onClick={() => onPreviewToggle(!openPreview)}
            className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 w-1/2 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium md:w-fit"
          >
            {!openPreview ? (
              <>
                <Eye fill="var(--color-icon-default-muted)" /> Preview
              </>
            ) : (
              <div className="flex items-center gap-1">
                <EyeClose fill="var(--color-icon-default-muted)" /> Hide Preview
              </div>
            )}
          </Button>
          <Button className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 w-1/2 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium md:w-34">
            <Save fill="var(--color-icon-default-muted)" /> Save as Draft
          </Button>
          <Button className="bg-bg-state-primary hover:bg-bg-state-primary/90! border-border-darker text-text-white-default hidden h-8 items-center gap-1 px-2.5 py-1.5 text-sm font-medium md:flex">
            <SendPlane fill="var(--color-icon-white-default)" /> Send Invoice
          </Button>
        </div>
      </div>
      <div className="border-border-default flex gap-2.5 border-b px-4 py-2 md:hidden">
        <Button className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 w-1/2 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium md:w-34">
          <Save fill="var(--color-icon-default-muted)" /> Save as Draft
        </Button>
        <Button
          onClick={() => onPreviewToggle(!openPreview)}
          className="bg-bg-state-secondary text-text-default border-border-darker flex h-8 w-1/2 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium md:w-fit"
        >
          {!openPreview ? (
            <>
              <Eye fill="var(--color-icon-default-muted)" /> Preview
            </>
          ) : (
            <div className="flex items-center gap-1">
              <EyeClose fill="var(--color-icon-default-muted)" /> Hide Preview
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
