import * as yup from "yup";

export const schoolSchema = yup.object().shape({
  firstName: yup.string().trim().required("First Name is required!"),
  lastName: yup.string().trim().required("Last Name is required!"),
  schoolName: yup.string().trim().required("School Name is required!"),
  schoolSize: yup.number().required("School Size is required!"),
  role: yup.string().trim().required("Role is required!"),
  country: yup.string().trim().required("Country is required!"),
  currency: yup.string().trim().required("Currency is required!"),
});
