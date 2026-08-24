const PHONE_CONFLICT_PATTERN = /phone number.*already exists/i;

/**
 * Points a duplicate-phone-number 409 at the phoneNumber field instead of only toasting it.
 * Returns true if it recognized and applied a field-level error.
 */
export const applyConflictFieldError = (error: unknown, setFieldError: (field: string, message: string) => void): boolean => {
  const message = (error as { message?: string } | null)?.message;
  if (!message || !PHONE_CONFLICT_PATTERN.test(message)) return false;
  setFieldError("phoneNumber", message);
  return true;
};
