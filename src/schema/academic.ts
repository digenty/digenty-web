import * as yup from "yup";

export const schoolStructureSchema = yup.object().shape({
  name: yup.string().required("Academic session is required"),
  currentTerm: yup.string().required("Current term is required"),
});

export const assessmentRowSchema = yup.object().shape({
  name: yup.string().required("Assessment name is required"),
  weight: yup
    .string()
    .required("Weight is required")
    .test("is-number", "Weight must be a number", val => !isNaN(parseFloat(val ?? ""))),
});

export const gradeRowSchema = yup.object().shape({
  grade: yup.string().required("Grade is required"),
  upperLimit: yup
    .string()
    .required("Upper limit is required")
    .test("is-number", "Must be a number", val => !isNaN(parseFloat(val ?? ""))),
  lowerLimit: yup
    .string()
    .required("Lower limit is required")
    .test("is-number", "Must be a number", val => !isNaN(parseFloat(val ?? ""))),
  remark: yup.string().required("Remark is required"),
});

export const schoolDefaultSchema = yup.object().shape({
  assessments: yup.array().of(assessmentRowSchema).min(1, "Add at least one assessment"),
  grades: yup.array().of(gradeRowSchema).min(1, "Add at least one grade row"),
});

export const schoolDefaultUpdateSchema = yup.object().shape({
  assessments: yup.array().of(assessmentRowSchema).optional(),
  grades: yup.array().of(gradeRowSchema).optional(),
});

export const admissionFormSchema = yup.object().shape({
  prefix: yup.string().required("Prefix is required"),
  numberFormat: yup.string().required("Number format is required"),
  startingNumber: yup.number().typeError("Starting number must be a number").min(1, "Must be at least 1").required("Starting number is required"),
  padding: yup.string().required("Padding is required"),
});
