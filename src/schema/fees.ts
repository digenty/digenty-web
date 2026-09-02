import * as yup from "yup";

const installmentsSchema = yup.array().when("paymentMode", {
  is: "INSTALLMENT",
  then: schema =>
    schema
      .of(
        yup.object({
          percentage: yup.number().moreThan(0, "Must be greater than 0").max(100, "Cannot exceed 100").required("Percentage is required"),
          dueDate: yup.date().required("Due date is required").typeError("Due date is required"),
          label: yup.string(),
        }),
      )
      .min(2, "An instalment schedule needs at least 2 instalments")
      .max(12, "An instalment schedule can have at most 12 instalments")
      .test("sums-to-100", "Instalment percentages must add up to 100", rows =>
        Math.round((rows ?? []).reduce((sum, r) => sum + Number(r?.percentage || 0), 0) * 100) === 10000,
      )
      .test("ascending-dates", "Instalment due dates must be in ascending order and cannot repeat", rows => {
        if (!rows || rows.length < 2) return true;
        const dates = rows.map(r => (r?.dueDate ? new Date(r.dueDate as unknown as string).getTime() : NaN));
        return dates.every((d, i) => i === 0 || d > dates[i - 1]);
      })
      .required("Instalment schedule is required"),
  otherwise: schema => schema.notRequired(),
});

// Used when adding a fee to a specific arm (armId comes from URL — no arm selection in form)
export const addFeeToClassSchema = yup.object({
  name: yup.string().trim().required("Fee name is required"),
  sessionId: yup.number().required("Session is required"),
  term: yup.string().required("Term is required"),
  quantity: yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
  amount: yup.number().min(0, "Amount must be positive").required("Amount is required"),
  required: yup.boolean(),
  paymentMode: yup.string().oneOf(["FULL", "FLEXIBLE", "INSTALLMENT"]).required("Payment mode is required"),
  installments: installmentsSchema,
});

// Used when adding a fee to all arms of a class (arm selection shown in form)
export const addFeeToClassWithArmsSchema = yup.object({
  armIds: yup.array().of(yup.number()).min(1, "Select at least one arm"),
  name: yup.string().trim().required("Fee name is required"),
  sessionId: yup.number().required("Session is required"),
  term: yup.string().required("Term is required"),
  quantity: yup.number().min(1, "Quantity must be at least 1").required("Quantity is required"),
  amount: yup.number().min(0, "Amount must be positive").required("Amount is required"),
  required: yup.boolean(),
  paymentMode: yup.string().oneOf(["FULL", "FLEXIBLE", "INSTALLMENT"]).required("Payment mode is required"),
  installments: installmentsSchema,
});

export const feeSchema = yup.object({
  name: yup.string().trim().required("Fee name is required"),
  sessionId: yup.number().required("Session is required"),
  term: yup.string().required("Term is required"),
  dueDate: yup.date().required("Due date is required"),
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
  paymentMode: yup.string().oneOf(["FULL", "FLEXIBLE", "INSTALLMENT"]).required("Payment mode is required"),
  installments: installmentsSchema,
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
