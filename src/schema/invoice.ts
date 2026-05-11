import * as yup from "yup";

export const invoiceSettingsSchema = yup.object({
  invoicePrefix: yup.string().trim().required("Invoice prefix is required"),
  numberFormat: yup.string().trim().required("Number format is required"),
  startingNumber: yup.number().min(1, "Must be at least 1").typeError("Must be a number").required("Starting number is required"),
  padding: yup.number().min(3).max(9).typeError("Must be a number").required("Padding is required"),
  defaultDueDate: yup.string().required("Default due date is required"),
  defaultNote: yup.string().required("Default note is required"),
  remindBeforeDays: yup.number().min(0).typeError("Must be a number").required("Remind before days is required"),
  remindAfterDays: yup.number().min(0).typeError("Must be a number").required("Remind after days is required"),
  repeatReminders: yup.boolean(),
  repeatEveryDays: yup.number().min(0).typeError("Must be a number"),
});
