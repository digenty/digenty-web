import * as yup from "yup";

export const authSchema = yup.object().shape({
  email: yup.string().max(254, "Email should not exceed 254 characters").trim().email("Invalid email").required("Email is required!"),
  password: yup.string().trim().min(8, "Password must be at least 8 characters").required("Password is required!"),
});
