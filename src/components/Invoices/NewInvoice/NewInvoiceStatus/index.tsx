"use client";

import { cn } from "@/lib/utils";
import { FormikProps } from "formik";
import type { InvoiceFormValues } from "../index";

import { Paid } from "./Paid";
import { PartiallyPaid } from "./PartiallyPaid";
import { UnPaid } from "./UnPaid";

type PaymentStatus = "UNPAID" | "PAID" | "PARTIALLY_PAID";

const TABS: { label: string; value: PaymentStatus }[] = [
  { label: "Unpaid", value: "UNPAID" },
  { label: "Paid", value: "PAID" },
  { label: "Partially Paid", value: "PARTIALLY_PAID" },
];

type Props = { formik: FormikProps<InvoiceFormValues> };

export const NewInvoiceStatus = ({ formik }: Props) => {
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

      {values.paymentStatus === "UNPAID" && <UnPaid formik={formik} />}
      {values.paymentStatus === "PAID" && <Paid formik={formik} />}
      {values.paymentStatus === "PARTIALLY_PAID" && <PartiallyPaid formik={formik} />}
    </div>
  );
};
