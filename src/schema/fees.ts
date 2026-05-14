import * as yup from "yup";

export const feeSchema = yup.object().shape({
  name: yup.string().required("Fee name is required"),

  session: yup.number().typeError("Session is required").required("Session is required").positive("Session is required"),

  term: yup
    .string()
    .oneOf(["FIRST", "SECOND", "THIRD"] as const, "Invalid term selected")
    .required("Term is required"),

  quantity: yup.number().typeError("Quantity must be a number").required("Quantity is required").min(1, "Quantity must be at least 1"),

  required: yup.boolean(),

  branchIds: yup.array().of(yup.number()),

  armIds: yup.array().of(yup.number()),

  selectedArmsInfo: yup.array(),

  setDifferentPricesPerBranch: yup.boolean(),

  setDifferentPricesPerClass: yup.boolean(),

  amount: yup
    .number()
    .typeError("Amount must be a number")
    .when(["setDifferentPricesPerBranch", "setDifferentPricesPerClass"], {
      is: (perBranch: boolean, perClass: boolean) => !perBranch && !perClass,
      then: schema => schema.required("Amount is required").min(0, "Amount must be 0 or greater"),
      otherwise: schema => schema.optional(),
    }),

  branchAmounts: yup.array().of(
    yup.object().shape({
      branchId: yup.number().required(),
      amount: yup.number().min(0).required(),
    }),
  ),

  classArmAmounts: yup.array().of(
    yup.object().shape({
      armId: yup.number().required(),
      amount: yup.number().min(0).required(),
    }),
  ),

  allowPartPayment: yup.boolean(),

  minimumPartPayment: yup
    .number()
    .typeError("Minimum payment must be a number")
    .when("allowPartPayment", {
      is: true,
      then: schema =>
        schema
          .required("Minimum payment is required")
          .positive("Minimum payment must be greater than 0")
          .when("amount", (amount, s) =>
            typeof amount === "number" && amount > 0 ? s.max(amount, "Minimum payment cannot exceed the full amount") : s,
          ),
      otherwise: schema => schema.optional(),
    }),
});

export const addFeeToClassSchema = yup.object().shape({
  name: yup.string().required("Fee name is required"),

  session: yup.number().typeError("Term is required").required("Term is required").positive("Term is required"),

  term: yup
    .string()
    .oneOf(["FIRST", "SECOND", "THIRD"] as const, "Invalid term selected")
    .required("Term is required"),

  quantity: yup.number().typeError("Quantity must be a number").required("Quantity is required").min(1, "Quantity must be at least 1"),

  amount: yup.number().typeError("Amount is required").required("Amount is required").min(0, "Amount must be 0 or greater"),

  required: yup.boolean(),

  allowPartPayment: yup.boolean(),

  minimumPartPayment: yup
    .number()
    .typeError("Minimum payment must be a number")
    .when("allowPartPayment", {
      is: true,
      then: schema =>
        schema
          .required("Minimum payment is required")
          .positive("Minimum payment must be greater than 0")
          .when("amount", (amount, s) =>
            typeof amount === "number" && amount > 0 ? s.max(amount, "Minimum payment cannot exceed the full amount") : s,
          ),
      otherwise: schema => schema.optional(),
    }),
});

export const addFeesToGroupSchema = yup.object().shape({
  name: yup.string().required("Fee group name is required"),
  description: yup.string().optional(),
  branchId: yup.number().typeError("Branch is required").required("Branch is required").positive("Branch is required"),
  session: yup.number().typeError("Term is required").required("Term is required").positive("Term is required"),
  term: yup
    .string()
    .oneOf(["FIRST", "SECOND", "THIRD"] as const, "Invalid term selected")
    .required("Term is required"),
});
