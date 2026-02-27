import * as yup from "yup";

export const staffSchema = yup.object().shape({
  firstName: yup.string().trim().required("First Name is required!"),
  lastName: yup.string().trim().required("Last Name is required!"),
  email: yup.string().required("Email is required!"),
  phoneNumber: yup.string().required("Phone Number is required!"),
  password: yup.string().required("Password is required!"),
});
