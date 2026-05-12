"use client";

import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { FormikProps } from "formik";
import type { InvoiceFormValues } from "@/components/Invoices/NewInvoice/index";
import { NoteEditor } from "@/components/Invoices/NewInvoice/NewInvoiceStatus/NoteEditor";

type PaymentStatus = "UNPAID" | "PAID" | "PARTIALLY_PAID";

const TABS: { label: string; value: PaymentStatus }[] = [
  { label: "Unpaid", value: "UNPAID" },
  { label: "Paid", value: "PAID" },
  { label: "Partially Paid", value: "PARTIALLY_PAID" },
];

type Props = { formik: FormikProps<InvoiceFormValues> };

export const EditStatus = ({ formik }: Props) => {
  const { values, setFieldValue } = formik;

  return (
    <div>
      <div className="text-text-default mb-4 text-lg font-semibold">Payment Status</div>

      <div className="bg-bg-state-soft flex w-fit max-w-80 items-center rounded-full p-0.5">
        {TABS.map(t => (
          <button
            key={t.value}
            type="button"
            onClick={() => setFieldValue("paymentStatus", t.value)}
            className={cn(
              "flex flex-1 justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors",
              values.paymentStatus === t.value
                ? "bg-bg-state-secondary border-border-darker text-text-default h-8 items-center rounded-full border shadow-sm"
                : "text-text-muted h-8 items-center",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <NoteEditor value={values.note} onChange={v => setFieldValue("note", v)} />
        <div className="flex items-center">
          <div className="w-full max-w-107">
            <div className="text-text-default text-sm font-medium">Show Account Details</div>
            <div className="text-text-subtle text-sm font-normal">
              Show the school account in payment and checkout on the invoice for offline payments
            </div>
          </div>
          <Switch checked={values.showAccountDetails} onCheckedChange={v => setFieldValue("showAccountDetails", v)} />
        </div>
      </div>
    </div>
  );
};
