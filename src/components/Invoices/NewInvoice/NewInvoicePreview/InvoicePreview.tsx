"use client";

import { Bank, BankCard, Download2, EyeClose, FileCopy, LogoMark } from "@digenty/icons";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckIcon, X } from "lucide-react";
import { PreviewTable } from "./PreviewTable";
import type { FormikProps } from "formik";
import type { InvoiceFormValues } from "../index";

type ToggleProp = {
  onPreviewToggle: (open: boolean) => void;
  formik: FormikProps<InvoiceFormValues>;
};

const formatDate = (d: Date | null) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

const StatusBadge = ({ status }: { status: InvoiceFormValues["paymentStatus"] }) => {
  if (status === "PAID")
    return (
      <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default rounded-md text-xs font-medium">
        <CheckIcon className="size-3" />
        <span>Paid</span>
      </Badge>
    );
  if (status === "PARTIALLY_PAID")
    return (
      <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default rounded-md text-xs font-medium">
        <span>Partially Paid</span>
      </Badge>
    );
  return (
    <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default rounded-md text-xs font-medium">
      <X className="size-3" />
      <span>Unpaid</span>
    </Badge>
  );
};

export const InvoicePreview = ({ onPreviewToggle, formik }: ToggleProp) => {
  const { values } = formik;
  const firstRecipient = values.billTo[0];
  const recipientLabel =
    values.billTo.length === 0
      ? "—"
      : values.billTo.length === 1
        ? firstRecipient.name
        : `${firstRecipient.name} +${values.billTo.length - 1} more`;

  const content = (
    <div className="bg-bg-subtle border-border-default rounded-sm border p-1.5">
      <div className="border-border-default bg-bg-default flex flex-col gap-6 rounded-sm border p-5">
        <div className="text-text-default flex items-center justify-between">
          <div className="flex items-center gap-1 text-lg font-bold">
            <LogoMark />
          </div>
          <div className="text-xl font-semibold">INVOICE</div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-text-default text-sm font-semibold">Bill for</div>
              <div className="flex items-center gap-1">
                <Avatar className="size-4" />
                <span className="text-text-informative text-sm font-medium">{recipientLabel}</span>
              </div>
            </div>
            <StatusBadge status={values.paymentStatus} />
          </div>

          <div className="flex flex-col gap-1">
            <div className="mt-0.5 flex items-center justify-between">
              <span className="text-text-muted text-sm font-normal">&nbsp;</span>
              <span className="text-text-muted text-sm font-normal">Issued Date</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between">
              <span className="text-text-muted text-sm font-normal">{values.invoiceNumber || "—"}</span>
              <span className="text-text-default text-sm font-medium">{formatDate(values.issuedDate)}</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-1">
            <div className="mt-0.5 flex items-center justify-between">
              <span className="text-text-default text-sm font-semibold">Invoice number</span>
              <span className="text-text-muted text-sm font-normal">Due Date</span>
            </div>
            <div className="mt-0.5 flex items-center justify-between">
              <span className="text-text-muted text-sm font-normal">{values.invoiceNumber || "—"}</span>
              <span className="text-text-default text-sm font-medium">{formatDate(values.dueDate)}</span>
            </div>
          </div>
        </div>

        <PreviewTable items={values.items} />

        <div>
          <div className="text-text-default mb-2 text-sm font-semibold">Note</div>
          <div className="bg-bg-muted text-text-default rounded-sm p-4 text-sm font-normal">
            {values.note || "No note added."}
          </div>
        </div>

        {values.showAccountDetails && (
          <>
            <div>
              <div className="text-text-default mb-2 text-sm font-semibold">Payment Options</div>
              <div className="border-border-default flex flex-col gap-2 rounded-sm border p-4">
                <div className="flex items-center gap-1">
                  <BankCard fill="var(--color-bg-basic-teal-accent)" />
                  <span className="text-text-default text-sm font-medium">Online Payment</span>
                </div>
                <div className="text-text-subtle text-sm">Pay securely with card or bank transfer.</div>
                <Button className="text-text-white-default bg-bg-state-primary hover:bg-bg-state-primary/90! h-7 w-full text-sm">Pay Online</Button>
              </div>
            </div>

            <div className="border-border-default flex flex-col gap-1 rounded-sm border p-4">
              <div className="text-text-default flex items-center gap-1 text-sm font-medium">
                <Bank fill="var(--color-bg-basic-purple-accent)" /> Bank Payment
              </div>
              <div className="text-text-subtle mb-2 text-sm font-normal">Transfer to our bank account using the details below</div>
              <div className="flex items-center justify-between">
                <div className="text-text-muted text-sm font-normal">Account Name</div>
                <div className="text-text-default text-sm font-medium">Greenfield Academy</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-text-muted text-sm font-normal">Account Number</div>
                <div className="text-text-default flex items-center gap-1 text-sm font-medium">
                  0123456789
                  <FileCopy fill="var(--color-icon-default-muted)" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-text-muted text-sm font-normal">Bank</div>
                <div className="text-text-default text-sm font-medium">Access Bank</div>
              </div>
              <div className="bg-bg-basic-orange-subtle text-text-subtle border-border-default rounded-xs border px-3 py-2.5 text-sm">
                <div className="font-semibold">Important:</div>
                Please include invoice number &apos;{values.invoiceNumber || "—"}&apos; as transfer reference
              </div>
            </div>
          </>
        )}

        <Button className="text-text-default border-border-default flex h-8 w-41 items-center gap-1 border px-2.5 py-1.5 text-sm font-medium">
          <Download2 fill="var(--color-icon-default-muted)" />
          Download Invoice
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block">{content}</div>
      <div className="fixed inset-0 z-50 md:hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex items-center justify-center p-4">
          <div className="max-h-[86vh] w-full overflow-y-auto">{content}</div>
        </div>
        <div onClick={() => onPreviewToggle(false)} className="absolute right-0 bottom-6 left-0 z-20 flex justify-center px-4">
          <Button className="text-text-default bg-bg-state-secondary border-border-darker flex items-center gap-2 rounded-md border px-4 py-2 text-center">
            <EyeClose fill="var(--color-icon-default-muted)" />
            <span>Hide preview</span>
          </Button>
        </div>
      </div>
    </>
  );
};
