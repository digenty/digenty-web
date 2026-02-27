import * as yup from "yup";

export const roleSchema = yup.object().shape({
  name: yup.string().trim().required("Role Name is required!"),
  description: yup.string().trim(),
});
