import * as yup from "yup";

export const invoiceSettingSchema = yup.object().shape({
  invoicePrefix: yup.string().required("Invoice prefix is required"),
  numberFormat: yup.string().required("Number format is required"),
  startNumber: yup.number().typeError("Must be a number").min(1, "Must be at least 1").required("Starting number is required"),
  padding: yup.string().required("Padding is required"),
  defaultDueDate: yup.string().required("Default due date is required"),
  defaultInvoiceNote: yup.string().required("Invoice note is required"),
  noOfDaysBeforeDueDate: yup.number().typeError("Must be a number").min(0).required("Required"),
  noOfDaysAfterDueDate: yup.number().typeError("Must be a number").min(0).required("Required"),
  repeatFrequency: yup.number().typeError("Must be a number").min(0),
});
