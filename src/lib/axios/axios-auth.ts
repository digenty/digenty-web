import { getSessionToken } from "@/app/actions/auth";
import { endSessionOfRequest, observeSession, sessionChangedError } from "@/lib/session-client";
import { decodeJWT } from "@/lib/utils";
import axios from "axios";
import { normalizeAxiosError } from "./normalize-error";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // if using cookies
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * - Attach auth token
 * - Refuse to send when another tab has swapped the shared session cookie for a different person's:
 *   this tab still shows the original person, so the request would run as someone it doesn't look like.
 */
api.interceptors.request.use(
  async config => {
    const { token, userType } = await getSessionToken();

    if (observeSession(decodeJWT(token), userType) === "changed") {
      throw sessionChangedError();
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

/**
 * Response interceptor
 * - Centralized error handling
 * - Guarantees `error.response.data` is the server's error object (see normalizeAxiosError)
 */
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Ends the session this request carried, not whatever the cookie holds by now.
      endSessionOfRequest(error.config?.headers?.Authorization);
    }

    return Promise.reject(await normalizeAxiosError(error));
  },
);

export default api;
