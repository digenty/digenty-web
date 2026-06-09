"use client";

import type { Recipient } from "./SelectRecipientsModal";
import type { InvoiceItem } from "./NewInvoiceItems/NewInvoiceMobileItem";

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
