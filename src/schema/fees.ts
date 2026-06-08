import * as yup from "yup";

export const addFeeToClassSchema = yup.object({
  name: yup.string().trim().required("Fee name is required"),
  session: yup.number().required("Session is required"),
  term: yup.string().required("Term is required"),
  quantity: yup.number().min(1).required("Quantity is required"),
  amount: yup.number().min(0).required("Amount is required"),
  required: yup.boolean(),
  allowPartPayment: yup.boolean(),
});

export const feeSchema = yup.object({
  name: yup.string().trim().required("Fee name is required"),
  session: yup.number().required("Session is required"),
  term: yup.string().required("Term is required"),
  quantity: yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
  required: yup.boolean(),
  armIds: yup.array().of(yup.number()).min(1, "Select at least one class or arm"),
  amount: yup.number().min(0, "Amount must be positive").required("Amount is required"),
  setDifferentPricesPerClass: yup.boolean(),
  classArmAmounts: yup.array().of(yup.object({ armId: yup.number().required(), amount: yup.number().min(0).required() })),
  allowPartPayment: yup.boolean(),
  minimumPartPayment: yup.number().min(0),
});

export const addFeesToGroupSchema = yup.object({
  name: yup.string().trim().required("Fee group name is required"),
  description: yup.string(),
  branchId: yup.number().required("Branch is required"),
  session: yup.number().required("Session is required"),
  term: yup.string().required("Term is required"),
});
