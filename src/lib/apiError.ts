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

export const SUBSCRIPTION_PATH = "/staff/settings/subscription";

export const isSubscriptionError = (error: unknown): boolean =>
  getApiErrorCode(error) === "SUBSCRIPTION_REQUIRED" || /subscription/i.test(getApiErrorMessage(error, ""));

// Props for <ErrorComponent /> / <PageEmptyState />: the server's message as the description, and a
// "Go to Subscription" button instead of the usual action when the failure is a missing subscription.
export const getErrorStateProps = (
  error: unknown,
  fallbackDescription = "This is our problem, we are looking into it so as to serve you better",
  action: { buttonText: string; url: string } = { buttonText: "Go to the Home page", url: "/staff/" },
) => ({
  description: getApiErrorMessage(error, fallbackDescription),
  ...(isSubscriptionError(error) ? { buttonText: "Go to Subscription", url: SUBSCRIPTION_PATH } : action),
});

// Same, for error states whose normal action is a "Retry" callback.
export const getRetryErrorProps = (error: unknown, fallbackDescription: string, retry: () => void) =>
  isSubscriptionError(error)
    ? { description: getApiErrorMessage(error, fallbackDescription), buttonText: "Go to Subscription", url: SUBSCRIPTION_PATH }
    : { description: getApiErrorMessage(error, fallbackDescription), buttonText: "Retry", onClick: retry };

export const getApiErrorDetails = (error: unknown): unknown => {
  if (error && typeof error === "object" && "details" in error) {
    return (error as ApiErrorBody).details;
  }
  return undefined;
};
