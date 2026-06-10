import * as yup from "yup";

export const addFeeToClassSchema = yup.object({
  armIds: yup.array().of(yup.number()).min(1, "Select at least one arm"),
  name: yup.string().trim().required("Fee name is required"),
  sessionId: yup.number().required("Session is required"),
  term: yup.string().required("Term is required"),
  quantity: yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
  amount: yup.number().min(0, "Amount must be positive").required("Amount is required"),
  required: yup.boolean(),
  allowPartPayment: yup.boolean(),
  minimumPartPayment: yup.number().when("allowPartPayment", {
    is: true,
    then: schema => schema.min(0).required("Minimum initial payment is required"),
    otherwise: schema => schema.notRequired(),
  }),
});

export const feeSchema = yup.object({
  name: yup.string().trim().required("Fee name is required"),
  sessionId: yup.number().required("Session is required"),
  term: yup.string().required("Term is required"),
  quantity: yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
  required: yup.boolean(),
  branchIds: yup.array().of(yup.number()).min(1, "Select at least one branch"),
  setDifferentPricesPerBranch: yup.boolean(),
  branchAmounts: yup.array().of(yup.object({ branchId: yup.number().required(), amount: yup.number().min(0).required("Amount is required") })),
  armIds: yup.array().of(yup.number()).min(1, "Select at least one class or arm"),
  setDifferentPricesPerClass: yup.boolean(),
  classArmAmounts: yup.array().of(yup.object({ armId: yup.number().required(), amount: yup.number().min(0).required("Amount is required") })),
  // A single flat amount is required only when neither per-branch nor per-class pricing is on.
  amount: yup.number().when(["setDifferentPricesPerBranch", "setDifferentPricesPerClass"], {
    is: (perBranch: boolean, perClass: boolean) => !perBranch && !perClass,
    then: schema => schema.min(0, "Amount must be positive").required("Amount is required"),
    otherwise: schema => schema.notRequired(),
  }),
  allowPartPayment: yup.boolean(),
  minimumPartPayment: yup.number().when("allowPartPayment", {
    is: true,
    then: schema => schema.min(0).required("Minimum initial payment is required"),
    otherwise: schema => schema.notRequired(),
  }),
});

export const addFeesToGroupSchema = yup.object({
  name: yup.string().trim().required("Fee group name is required"),
  description: yup.string(),
  branchId: yup.number().required("Branch is required"),
  sessionId: yup.number().required("Session is required"),
  term: yup.string().required("Term is required"),
  items: yup
    .array()
    .of(
      yup.object({
        name: yup.string().trim().required("Item name is required"),
        qty: yup.number().min(1, "Qty must be at least 1").required("Qty is required"),
        price: yup.number().min(0, "Price must be positive").required("Price is required"),
      }),
    )
    .min(1, "Add at least one item"),
});
