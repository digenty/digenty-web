"use client";

import { ArrRight } from "@digenty/icons";
import { toast } from "@/components/Toast";
import { Button } from "../../ui/button";
import { useCreateInvoice, useCreateInvoiceDraft } from "@/hooks/queryHooks/useInvoice";
import { newInvoiceSchema } from "@/schema/invoice";
import { useFormik } from "formik";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Recipient } from "./SelectRecipientsModal";
import type { InvoiceItem } from "./NewInvoiceItems/NewInvoiceMobileItem";
import { NewInvoiceDetail } from "./NewInvoiceDetails/NewInvoiceDetail";
import { NewInvoiceHeader } from "./NewInvoiceHeader";
import { NewInvoiceItem } from "./NewInvoiceItems/NewInvoiceItem";
import { InvoicePreview } from "./NewInvoicePreview/InvoicePreview";
import { NewInvoiceStatus } from "./NewInvoiceStatus";
import { INVOICE_STEPS, useInvoiceStep } from "./step";

export type InvoiceFormValues = {
  billTo: Recipient[];
  invoiceNumber: string;
  termId: number | null;
  issuedDate: Date | null;
  dueDate: Date | null;
  items: InvoiceItem[];
  note: string;
  showAccountDetails: boolean;
  paymentStatus: "UNPAID" | "PAID" | "PARTIALLY_PAID";
  paymentMethod: string;
  amount: string;
  transactionDate: Date | null;
};

const buildPayload = (values: InvoiceFormValues) => ({
  studentIds: values.billTo.filter(r => r.type === "student").map(r => r.id),
  invoiceNumber: values.invoiceNumber.trim(),
  termId: values.termId!,
  issuedDate: values.issuedDate!.toISOString(),
  dueDate: values.dueDate!.toISOString(),
  items: values.items
    .filter(i => i.name.trim())
    .map(i => ({ id: 0, name: i.name, quantity: i.qty, price: i.price, required: i.required, stockItemId: 0, feeId: 0, feeGroupItemId: 0 })),
  subtotal: values.items.reduce((acc, i) => acc + i.qty * i.price, 0),
  note: values.note,
  showAccountDetails: values.showAccountDetails,
  paymentStatus: values.paymentStatus,
  ...(values.paymentStatus !== "UNPAID" && {
    payment: {
      method: values.paymentMethod,
      terminalTransactionId: null,
      paidById: 0,
      amount: Number(values.amount),
      transactionDate: values.transactionDate?.toISOString() ?? new Date().toISOString(),
    },
  }),
});

export const NewInvoice = () => {
  const router = useRouter();
  const [openPreview, setOpenPreview] = useState(false);
  const { step, goToStep } = useInvoiceStep();
  const stepIndex = INVOICE_STEPS.findIndex(s => s.key === step);

  const { mutate, isPending } = useCreateInvoice();
  const { mutate: saveDraft, isPending: isDraftPending } = useCreateInvoiceDraft();

  const formik = useFormik<InvoiceFormValues>({
    initialValues: {
      billTo: [],
      invoiceNumber: "",
      termId: null,
      issuedDate: null,
      dueDate: null,
      items: [{ id: crypto.randomUUID(), name: "", qty: 1, price: 0, required: false }],
      note: "",
      showAccountDetails: false,
      paymentStatus: "UNPAID",
      paymentMethod: "BANK_TRANSFER_TERMINAL",
      amount: "",
      transactionDate: null,
    },
    validationSchema: newInvoiceSchema,
    onSubmit: values => {
      mutate(buildPayload(values), {
        onSuccess: () => {
          toast({ title: "Invoice sent successfully", type: "success" });
          router.push("/staff/invoices");
        },
        onError: (error: unknown) => {
          const msg = error instanceof Error ? error.message : "Failed to send invoice";
          toast({ title: msg, type: "error" });
        },
      });
    },
  });

  const handleSaveDraft = () => {
    saveDraft(buildPayload(formik.values), {
      onSuccess: () => {
        toast({ title: "Draft saved successfully", type: "success" });
        router.push("/staff/invoices");
      },
      onError: (error: unknown) => {
        const msg = error instanceof Error ? error.message : "Failed to save draft";
        toast({ title: msg, type: "error" });
      },
    });
  };

  return (
    <div className="pb-10">
      <NewInvoiceHeader
        openPreview={openPreview}
        onPreviewToggle={setOpenPreview}
        onSendInvoice={() => formik.handleSubmit()}
        isPending={isPending}
        onSaveDraft={handleSaveDraft}
        isDraftPending={isDraftPending}
      />
      <div className={`grid ${openPreview ? "grid-cols-2" : "grid-cols-1"}`}>
        {/* Desktop — all sections visible */}
        <div className="border-border-default mx-4 hidden h-fit flex-col gap-6 rounded-md border p-6 md:mx-8 md:flex">
          <NewInvoiceDetail formik={formik} />
          <NewInvoiceItem formik={formik} />
          <NewInvoiceStatus formik={formik} />
        </div>

        {/* Mobile — step-by-step */}
        <div className="mx-4 flex flex-col justify-between gap-4 md:hidden">
          <div className="mb-20">
            {step === "details" && <NewInvoiceDetail formik={formik} />}
            {step === "items" && <NewInvoiceItem formik={formik} />}
            {step === "status" && <NewInvoiceStatus formik={formik} />}
          </div>

          <div className="border-border-default bg-bg-default absolute right-0 bottom-0 left-0 z-20 mt-4 flex w-full justify-between gap-2 border-t p-2">
            {stepIndex > 0 && (
              <Button
                variant="outline"
                className="bg-bg-state-soft! text-text-subtle h-8! rounded-sm border-none px-2.5! py-1.5 text-sm"
                onClick={() => goToStep(INVOICE_STEPS[stepIndex - 1].key)}
              >
                Back
              </Button>
            )}
            <div>
              {stepIndex === 0 && <Button className="bg-bg-state-soft! text-text-subtle h-8! border-none px-2.5! py-1.5 text-sm">Cancel</Button>}
            </div>
            <div>
              {stepIndex < INVOICE_STEPS.length - 1 ? (
                <Button
                  className="text-text-white-default bg-bg-state-primary! h-8! border-none px-2.5! py-1.5 text-sm"
                  onClick={() => goToStep(INVOICE_STEPS[stepIndex + 1].key)}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={() => formik.handleSubmit()}
                  disabled={isPending}
                  className="text-text-white-default bg-bg-state-primary! h-8! border-none px-2.5! py-1.5 text-sm"
                >
                  <ArrRight fill="var(--color-icon-white-default)" /> Send Invoice
                </Button>
              )}
            </div>
          </div>
        </div>

        {openPreview && <InvoicePreview onPreviewToggle={setOpenPreview} formik={formik} />}
      </div>
    </div>
  );
};
