import * as yup from "yup";

export const emailSchema = yup.object().shape({
  email: yup.string().max(254, "Email should not exceed 254 characters").trim().email("Invalid email").required("Email is required!"),
});

export const authSchema = yup.object().shape({
  email: yup.string().max(254, "Email should not exceed 254 characters").trim().email("Invalid email").required("Email is required!"),
  password: yup.string().trim().min(8, "Password must be at least 8 characters").required("Password is required!"),
});

export const resetPasswordSchema = yup.object().shape({
  email: yup.string().max(254, "Email should not exceed 254 characters").trim().email("Invalid email").required("Email is required!"),
  otp: yup.string().length(6, "OTP must be 6 characters").required("OTP is required!"),
  newPassword: yup.string().trim().min(8, "Password must be at least 8 characters").required("Password is required!"),
  confirmPassword: yup.string().trim().min(8, "Password must be at least 8 characters").required("Confirm Password is required!"),
});

export const verifyOtpSchema = yup.object().shape({
  email: yup.string().max(254, "Email should not exceed 254 characters").trim().email("Invalid email").required("Email is required!"),
  otp: yup.string().length(6, "OTP must be 6 characters").required("OTP is required!"),
});

export const userEmailSchema = yup.object().shape({
  email: yup.string().max(254, "Email should not exceed 254 characters").trim().email("Invalid email").required("Email is required!"),
});
