import * as yup from "yup";

export const AdmissonNewCycleSchema = yup.object({
  name: yup.string().trim().required("Cycle name is required"),
  startDate: yup.date().required("Start date is required").nullable(),
  endDate: yup.date().required("End date is required").nullable().min(yup.ref("startDate"), "End date must be after start date"),
});
