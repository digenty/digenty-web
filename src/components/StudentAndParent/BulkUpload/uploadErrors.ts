// Bulk-upload file/batch errors (422 and 410 on the validate/commit routes) use their own
// envelope — `{ error: { code, message } }` — not the standard `{ status, errorCode, message }`
// error shape used everywhere else in the API. Some codes (notably BATCH_EXPIRED) have also been
// seen falling through to a generic 400 with the message at the top level instead, so every
// helper here checks both shapes rather than assuming one.
export type UploadErrorBody = {
  message?: string;
  details?: { code?: string };
  error?: { code?: string; message?: string };
};

const EXPIRED_MESSAGE_HINT = /session expired/i;

export const getUploadErrorCode = (error: unknown): string | undefined => {
  const body = error as UploadErrorBody;
  return body?.error?.code ?? body?.details?.code;
};

export const getUploadErrorMessage = (error: unknown, fallback: string) => {
  const body = error as UploadErrorBody;
  return body?.error?.message ?? body?.message ?? fallback;
};

// BatchExpiredException doesn't always land through the dedicated 422/410 handler — match on
// the message too, since `code` isn't reliably present when it falls through to a generic 400.
export const isBatchExpired = (error: unknown) => {
  return getUploadErrorCode(error) === "BATCH_EXPIRED" || EXPIRED_MESSAGE_HINT.test(getUploadErrorMessage(error, ""));
};

// Parents-only: commit refuses the whole batch when any row is invalid.
export const isBatchHasInvalidRows = (error: unknown) => getUploadErrorCode(error) === "BATCH_HAS_INVALID_ROWS";

// A column header wasn't recognised at all (as opposed to a required one being missing).
// The message already names the offending headers and valid targets — safe to show verbatim.
export const isUnknownHeaders = (error: unknown) => getUploadErrorCode(error) === "UNKNOWN_HEADERS";
