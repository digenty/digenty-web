// Shape of an *unwrapped* error body — GlobalExceptionHandler sends 4xx/5xx without the
// { success, data, ... } envelope that wraps every 2xx response. See api/domain.ts callers:
// they rethrow `error.response?.data` directly, so that's what lands here.
export interface ApiErrorBody {
  status?: number;
  error?: string;
  message?: string;
  errorCode?: string;
  details?: unknown;
  path?: string;
  timestamp?: string;
  traceId?: string;
}

export const getApiErrorCode = (error: unknown): string | undefined => {
  if (error && typeof error === "object" && "errorCode" in error) {
    const code = (error as ApiErrorBody).errorCode;
    return typeof code === "string" ? code : undefined;
  }
  return undefined;
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object") {
    const e = error as ApiErrorBody & { detail?: string };
    return e.message || e.error || e.detail || fallback;
  }
  return fallback;
};

export const getApiErrorDetails = (error: unknown): unknown => {
  if (error && typeof error === "object" && "details" in error) {
    return (error as ApiErrorBody).details;
  }
  return undefined;
};
