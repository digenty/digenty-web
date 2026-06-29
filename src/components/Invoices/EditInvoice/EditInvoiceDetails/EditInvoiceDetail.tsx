"use client";

import { FormikProps } from "formik";
// import type { InvoiceFormValues } from "@/components/Invoices/NewInvoice/index";
// EditInvoiceDetail shares the same layout and fields as NewInvoiceDetail.
import { NewInvoiceDetail } from "@/components/Invoices/NewInvoice/NewInvoiceDetails/NewInvoiceDetail";
import { InvoiceFormValues } from "../../NewInvoice/context";

type Props = { formik: FormikProps<InvoiceFormValues> };

export const EditInvoiceDetail = ({ formik }: Props) => <NewInvoiceDetail formik={formik} />;
