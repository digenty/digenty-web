"use client";

import { FormikProps } from "formik";
import type { InvoiceFormValues } from "@/components/Invoices/NewInvoice/index";
// EditInvoiceItem shares the same layout and fields as NewInvoiceItem.
import { NewInvoiceItem } from "@/components/Invoices/NewInvoice/NewInvoiceItems/NewInvoiceItem";

type Props = { formik: FormikProps<InvoiceFormValues> };

export const EditInvoiceItem = ({ formik }: Props) => <NewInvoiceItem formik={formik} />;
