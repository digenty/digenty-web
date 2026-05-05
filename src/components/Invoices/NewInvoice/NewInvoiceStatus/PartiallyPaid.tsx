"use client";

import { FormikProps } from "formik";
import type { InvoiceFormValues } from "../index";
import { Paid } from "./Paid";

// Partially paid has the same fields as Paid — only paymentStatus differs in the payload.
export const PartiallyPaid = ({ formik }: { formik: FormikProps<InvoiceFormValues> }) => <Paid formik={formik} />;
