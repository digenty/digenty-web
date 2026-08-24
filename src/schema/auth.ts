import * as yup from "yup";

const isEmailShaped = (value: string) => value.includes("@");
const isPhoneShaped = (value: string) => /^[+\d][\d\s-]{6,17}$/.test(value);

// Accepts an email address or a phone number — the backend treats both as a login identifier.
export const identifierSchema = yup
  .string()
  .trim()
  .max(254, "Should not exceed 254 characters")
  .required("Email or phone number is required!")
  .test("email-or-phone", "Enter a valid email address or phone number", value => {
    if (!value) return false;
    return isEmailShaped(value) ? yup.string().email().isValidSync(value) : isPhoneShaped(value);
  });

// Staff email lookup (`GET /users/email/lookup/{email}`) is email-specific — keep this strict.
export const emailSchema = yup.object().shape({
  email: yup.string().max(254, "Email should not exceed 254 characters").trim().email("Invalid email").required("Email is required!"),
});

export const authSchema = yup.object().shape({
  email: identifierSchema,
  password: yup.string().trim().min(5, "Password must be at least 5 characters").required("Password is required!"),
});

export const resetPasswordSchema = yup.object().shape({
  email: identifierSchema,
  otp: yup.string().length(6, "OTP must be 6 characters").required("OTP is required!"),
  newPassword: yup.string().trim().min(8, "Password must be at least 8 characters").required("Password is required!"),
  confirmPassword: yup.string().trim().min(8, "Password must be at least 8 characters").required("Confirm Password is required!"),
});

export const verifyOtpSchema = yup.object().shape({
  email: identifierSchema,
  otp: yup.string().length(6, "OTP must be 6 characters").required("OTP is required!"),
});

// Forgot-password entry — shared by staff and parent, so a phone-only parent must be able to use it.
export const userEmailSchema = yup.object().shape({
  email: identifierSchema,
});

export const verifyChangePasswordOtpSchema = yup.object().shape({
  otp: yup.string().length(6, "OTP must be 6 characters").required("OTP is required!"),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().trim().min(8, "Password must be at least 8 characters").required("Old password is required!"),
  newPassword: yup.string().trim().min(8, "Password must be at least 8 characters").required("New password is required!"),
  confirmPassword: yup
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .oneOf([yup.ref("newPassword")], "Confirm password must match new password")
    .required("Confirm password is required!"),
});
