// Shape of an *unwrapped* error body — GlobalExceptionHandler sends 4xx/5xx without the
// { success, data, ... } envelope that wraps every 2xx response. See api/domain.ts callers:
// they rethrow `error.response?.data` directly, so that's what lands here.
// The axios interceptors (lib/axios/normalize-error.ts) guarantee that object shape even when the
// server sent no JSON (offline, timeout, gateway page, failed file download).
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

// What axios says when it has nothing better ("Request failed with status code 400", "Network Error", ...).
// It tells the user nothing, so it counts as "no message" and the caller's own fallback is shown instead.
const GENERIC_TRANSPORT_MESSAGE = /^(request failed with status code \d+|network error|timeout of \d+ms exceeded|aborted|canceled)$/i;

const usableMessage = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const text = value.trim();
  return text && !GENERIC_TRANSPORT_MESSAGE.test(text) ? text : undefined;
};

// The server's own explanation of a failure, or undefined when it gave none. Use it as an error toast's `description`
// (under a title saying what failed) so the description is simply left out when there is nothing to add.
export const getApiErrorReason = (error: unknown): string | undefined => {
  if (typeof error === "string") return usableMessage(error);

  if (error && typeof error === "object") {
    const e = error as ApiErrorBody & { detail?: string };
    return usableMessage(e.message) ?? usableMessage(e.error) ?? usableMessage(e.detail);
  }
  return undefined;
};

// Always returns something safe to put in a toast or an error state: the server's own message when there is one, otherwise `fallback`.
export const getApiErrorMessage = (error: unknown, fallback: string): string => getApiErrorReason(error) ?? fallback;

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
