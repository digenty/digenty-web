import * as yup from "yup";

export const AssessmentAndGradingSchema = yup.object().shape({
  grades: yup.array().of(
    yup.object({
      grade: yup.string().required("Grade is required"),
      upperLimit: yup.string().required("Upper limit is required"),
      lowerLimit: yup.string().required("Lower limit is required"),
      remark: yup.string().required("Remark is required"),
    }),
  ),
  assessments: yup.array().of(
    yup.object({
      name: yup.string().required("Name is required"),
      weight: yup.string().required("Weight is required"),
    }),
  ),
});
