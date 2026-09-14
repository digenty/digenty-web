export type UploadErrorBody = {
  message?: string;
  details?: { code?: string };
};

const EXPIRED_MESSAGE_HINT = /session expired/i;

export const getUploadErrorMessage = (error: unknown, fallback: string) => (error as UploadErrorBody)?.message ?? fallback;

// BatchExpiredException has no dedicated handler on the backend, so it falls through to the
// generic 400 handler and `details.code` is not reliably "BATCH_EXPIRED" — match on the message too.
export const isBatchExpired = (error: unknown) => {
  const body = error as UploadErrorBody;
  return body?.details?.code === "BATCH_EXPIRED" || EXPIRED_MESSAGE_HINT.test(body?.message ?? "");
};

// Parents-only: commit refuses the whole batch when any row is invalid.
export const isBatchHasInvalidRows = (error: unknown) => (error as UploadErrorBody)?.details?.code === "BATCH_HAS_INVALID_ROWS";
