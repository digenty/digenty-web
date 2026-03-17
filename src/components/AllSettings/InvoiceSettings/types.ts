export const DIGITS = [3, 4, 5, 6, 7, 8, 9];
export const DUE_DATES = ["Today", "Tomorrow"];

export type FormValues = {
  invoicePrefix: string;
  numberFormat: string;
  startNumber: string;
  padding: string;
  defaultDueDate: string;
  defaultInvoiceNote: string;
  noOfDaysBeforeDueDate: string;
  noOfDaysAfterDueDate: string;
  repeatFrequency: string;
  image: string;
};
