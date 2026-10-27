import { isAxiosError, type AxiosResponse } from "axios";
import type { ApiErrorBody } from "@/lib/apiError";

const NETWORK_ERROR_MESSAGE = "Can't reach the server. Check your internet connection and try again.";
const TIMEOUT_ERROR_MESSAGE = "The request took too long. Please try again.";
const SERVER_ERROR_MESSAGE = "Something went wrong on our end. Please try again shortly.";

// Used only when the server sent no message of its own. Other 4xx statuses are left without one so the
// caller's own fallback (e.g. "Could not delete student") is shown instead.
const STATUS_MESSAGES: Record<number, string> = {
  403: "You don't have permission to do this.",
  413: "That file is too large to upload.",
  429: "Too many requests. Please wait a moment and try again.",
};

const isPlainObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

const hasMessage = (body: Record<string, unknown>) => typeof body.message === "string" && body.message.trim() !== "";

const parseText = (text: string): unknown => {
  const trimmed = text.trim();
  if (!trimmed) return undefined;

  try {
    const parsed: unknown = JSON.parse(trimmed);
    return typeof parsed === "string" ? { message: parsed } : parsed;
  } catch {
    // Not JSON. An HTML page (proxy / gateway error) is no use in a toast; short plain text is.
    return trimmed.startsWith("<") || trimmed.length > 300 ? undefined : { message: trimmed };
  }
};

// Error bodies of `responseType: "blob"` requests (exports, templates) arrive as a Blob, and proxies often answer with plain text.
const readBody = async (data: unknown): Promise<unknown> => {
  if (typeof Blob !== "undefined" && data instanceof Blob) return parseText(await data.text());
  if (data instanceof ArrayBuffer) return parseText(new TextDecoder().decode(data));
  if (typeof data === "string") return parseText(data);
  return data;
};

/**
 * Makes `error.response.data` always the server's error object, which is what every `throw error.response?.data`
 * in `src/api` rethrows. Without this, a dropped connection, a timeout, a gateway page or a failed file download
 * rethrows `undefined`, a string or a Blob, so the real reason never reaches the toast.
 *
 * - A body that already carries a `message` is left exactly as the server sent it.
 * - No response at all (offline, timeout) gets a response with `status: 0` and a readable message.
 * - Anything else is turned into `{ status, message? }`, with a message only where we can say something useful.
 */
export const normalizeAxiosError = async (error: unknown): Promise<unknown> => {
  if (!isAxiosError(error) || error.code === "ERR_CANCELED") return error;

  const { response } = error;

  if (!response) {
    const timedOut = error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";
    const body: ApiErrorBody = timedOut
      ? { status: 0, errorCode: "TIMEOUT", message: TIMEOUT_ERROR_MESSAGE }
      : { status: 0, errorCode: "NETWORK_ERROR", message: NETWORK_ERROR_MESSAGE };

    error.response = { data: body, status: 0, statusText: "", headers: {}, config: error.config } as AxiosResponse;
    return error;
  }

  const body = await readBody(response.data);

  if (isPlainObject(body) && hasMessage(body)) {
    response.data = body;
    return error;
  }

  const { status } = response;
  const message = status >= 500 ? SERVER_ERROR_MESSAGE : STATUS_MESSAGES[status];

  response.data = { ...(isPlainObject(body) ? body : {}), status, ...(message && { message }) } satisfies ApiErrorBody;
  return error;
};
