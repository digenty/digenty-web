import api from "@/lib/axios/axios-auth";
import { isAxiosError } from "axios";

// Backend contract: one parent signup link per school, managed at /parents/signup-link.
// The response carries a ready-made `url` ({APP_FRONTEND_URL}/parent/signup/{token}) — always copy that
// rather than rebuilding it here, so the link follows whatever frontend URL the backend is configured with.
export type SignupLink = {
  url: string;
  token?: string;
  active: boolean;
};

// Success responses are wrapped in { data }, so unwrap defensively, as the other API files do.
const unwrap = (body: unknown): Record<string, unknown> | null => {
  if (!body || typeof body !== "object") return null;
  const inner = (body as { data?: unknown }).data ?? body;
  return inner && typeof inner === "object" ? (inner as Record<string, unknown>) : null;
};

const toSignupLink = (body: unknown): SignupLink | null => {
  const link = unwrap(body);
  if (!link || typeof link.url !== "string" || !link.url) return null;
  return {
    url: link.url,
    token: typeof link.token === "string" ? link.token : undefined,
    // A missing flag is read as active; only an explicit false turns the link off.
    active: link.active !== false,
  };
};

// Resolves to null when the school has no link yet (404), so the UI can offer "Create link".
export const getSignupLink = async (): Promise<SignupLink | null> => {
  try {
    const { data } = await api.get("/parents/signup-link");
    return toSignupLink(data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.status === 404) return null;
      throw error.response?.data;
    }
    // The axios interceptors rethrow a normalized object, so a 404 may arrive as that instead.
    if (error && typeof error === "object" && (error as { status?: number }).status === 404) return null;
    throw error;
  }
};

// Creates the link, or regenerates it — the previous link stops working.
export const createSignupLink = async (): Promise<SignupLink | null> => {
  try {
    const { data } = await api.post("/parents/signup-link");
    return toSignupLink(data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};

export const setSignupLinkActive = async (active: boolean): Promise<SignupLink | null> => {
  try {
    const { data } = await api.patch("/parents/signup-link", null, { params: { active } });
    return toSignupLink(data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
