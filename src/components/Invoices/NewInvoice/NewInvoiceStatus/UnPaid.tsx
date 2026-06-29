"use client";

import { Switch } from "@/components/ui/switch";
import { FormikProps } from "formik";
import type { InvoiceFormValues } from "../index";
import { NoteEditor } from "./NoteEditor";

type Props = { formik: FormikProps<InvoiceFormValues> };

export const UnPaid = ({ formik }: Props) => (
  <div className="flex flex-col gap-6">
    <div className="mt-6">
      <NoteEditor value={formik.values.note} onChange={v => formik.setFieldValue("note", v)} />
    </div>
    <div className="flex items-center">
      <div className="w-full max-w-107">
        <div className="text-text-default text-sm font-medium">Show Account Details</div>
        <div className="text-text-subtle text-sm font-normal">
          Show the school account in payment and checkout on the invoice for offline payments
        </div>
      </div>
      <Switch checked={formik.values.showAccountDetails} onCheckedChange={v => formik.setFieldValue("showAccountDetails", v)} />
    </div>
  </div>
);
