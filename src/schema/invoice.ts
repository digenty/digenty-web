import * as yup from "yup";

export const newInvoiceSchema = yup.object({
  billTo: yup.array().min(1, "Please select at least one recipient"),
  invoiceNumber: yup.string().trim(),
  termId: yup.number().nullable().typeError("Must be a number"),
  issuedDate: yup.date().nullable().required("Issued date is required").typeError("Issued date is required"),
  dueDate: yup.date().nullable().required("Due date is required").typeError("Due date is required"),
  items: yup
    .array()
    .of(yup.object({ name: yup.string().trim().required("Item name is required") }))
    .min(1, "At least one item is required"),
  paymentStatus: yup.string().required(),
  amount: yup.string().when("paymentStatus", {
    is: (v: string) => v !== "UNPAID",
    then: s => s.required("Amount is required").test("gt0", "Amount must be greater than 0", v => Number(v) > 0),
    otherwise: s => s,
  }),
});

export const editInvoiceSchema = yup.object({
  billTo: yup.array().min(1, "Please select at least one recipient"),
  invoiceNumber: yup.string().trim().required("Invoice number is required"),
  termId: yup.number().nullable().typeError("Must be a number"),
  issuedDate: yup.date().nullable().required("Issued date is required").typeError("Issued date is required"),
  dueDate: yup.date().nullable().required("Due date is required").typeError("Due date is required"),
  items: yup
    .array()
    .of(yup.object({ name: yup.string().trim().required("Item name is required") }))
    .min(1, "At least one item is required"),
  paymentStatus: yup.string().required(),
});

export const addPaymentSchema = yup.object().shape({
  transactionDate: yup.date().typeError("Transaction date is required").required("Transaction date is required"),
  method: yup.string().required("Payment method is required"),
  terminalTransactionId: yup.string().nullable(),
  paidById: yup.number().min(1, "Please select who paid").required("Please select who paid"),
  amount: yup.number().typeError("Amount must be a number").min(0.01, "Amount must be greater than 0").required("Amount is required"),
  note: yup.string(),
});

export const invoiceSettingsSchema = yup.object({
  invoicePrefix: yup.string(),
  numberFormat: yup.string(),
  startingNumber: yup.number().min(1).typeError("Must be a number"),
  padding: yup.number().min(3).max(9).typeError("Must be a number"),
  defaultDueDate: yup.string(),
  defaultNote: yup.string(),
  remindBeforeDays: yup.number().min(0).typeError("Must be a number"),
  remindAfterDays: yup.number().min(0).typeError("Must be a number"),
  repeatReminders: yup.boolean(),
  repeatEveryDays: yup.number().min(0).typeError("Must be a number"),
});
