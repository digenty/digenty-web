import * as yup from "yup";

const PAYMENT_METHODS = ["CASH", "POS", "CHEQUE", "BANK_TRANSFER", "BANK_TRANSFER_TERMINAL", "ONLINE"];
const RECURRING_INTERVALS = ["DAILY", "WEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"];

const recurringInterval = yup.string().when("recurring", {
  is: true,
  then: schema => schema.oneOf(RECURRING_INTERVALS, "Interval is required").required("Interval is required"),
  otherwise: schema => schema.notRequired(),
});

export const expenseSchema = yup.object().shape({
  title: yup.string().trim().required("Expense title is required"),
  description: yup.string().trim(),
  amount: yup.number().typeError("Amount is required").required("Amount is required").moreThan(0, "Amount must be greater than 0"),
  date: yup.string().trim().required("Date is required"),
  categoryId: yup.number().typeError("Category is required").notRequired(),
  branchId: yup.number().typeError("Branch is required").notRequired(),
  paymentMethod: yup.string().oneOf(PAYMENT_METHODS, "Payment method is required").required("Payment method is required"),
  receiptPath: yup.string().trim().required("Receipt is required"),
  recurring: yup.boolean(),
  recurringInterval,
});

export const editExpenseSchema = yup.object().shape({
  expenseId: yup.number().required().min(1),
  title: yup.string().trim().required("Expense title is required"),
  description: yup.string().trim(),
  amount: yup.number().typeError("Amount is required").required("Amount is required").moreThan(0, "Amount must be greater than 0"),
  date: yup.string().trim().required("Date is required"),
  categoryId: yup.number().typeError("Category is required").notRequired(),
  branchId: yup.number().typeError("Branch is required").notRequired(),
  paymentMethod: yup.string().oneOf(PAYMENT_METHODS, "Payment method is required").required("Payment method is required"),
  receiptPath: yup.string().trim(),
  recurring: yup.boolean(),
  recurringInterval,
});

export const expenseCategorySchema = yup.object().shape({
  name: yup.string().trim().required("Category name is required"),
});
