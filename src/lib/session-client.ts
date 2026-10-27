import {
  createSession as createSessionAction,
  deleteSession as deleteSessionAction,
  deleteSessionIfCurrent,
  getSessionData,
} from "@/app/actions/auth";
import { SESSION_CHANGED_CODE, createTabTracker, identityOf, type SessionUserType } from "@/lib/session-identity";
import { decodeJWT } from "@/lib/utils";
import { useSessionNoticeStore } from "@/store/session";
import type { JWTPayload } from "@/types";

// The login session is one cookie shared by every tab of the browser, so signing in as someone else in
// another tab swaps it under this one. The tab remembers who it was started as; this is what lets it
// notice the swap, stop acting as the new person, and ask the user what to do (see SessionGuard).
//
// Module state lives in the browser only: on the server this module would be shared by every user.
const tab = createTabTracker<JWTPayload>();
const inBrowser = () => typeof window !== "undefined";

export type SessionVerdict = "ok" | "changed" | "signed-out";

// What the axios layer raises instead of sending a request as someone other than the person this tab shows.
export const sessionChangedError = () => ({
  status: 0,
  errorCode: SESSION_CHANGED_CODE,
  message: "You signed in as someone else in another tab. Continue as them, or sign out, to keep going.",
});

/** Reports the session the cookie holds right now. Adopts it if the tab has none yet; "changed" if it's a different person. */
export const observeSession = (user: JWTPayload | null, userType?: SessionUserType): "ok" | "changed" => {
  if (!inBrowser() || !user) return "ok";

  const verdict = tab.observe(identityOf(user, userType), user);
  const notices = useSessionNoticeStore.getState();

  if (verdict === "changed") notices.showChanged({ name: user.name, userType });
  else notices.clear(); // the cookie is back to this tab's person, so any earlier warning no longer applies

  return verdict;
};

/** The user this tab was started as (not necessarily who the cookie holds now). */
export const getTabUser = () => tab.user();

/** Forget who this tab is. Called when *this* tab signs in or out on purpose, so the next session is adopted, not flagged. */
export const resetTabSession = () => {
  tab.reset();
  useSessionNoticeStore.getState().clear();
};

/** Deliberate sign-in from this tab. */
export const login = (token: string, userType: SessionUserType) => {
  resetTabSession();
  return createSessionAction(token, userType);
};

/** Deliberate sign-out from this tab. Like any logout it ends the shared session for every tab. */
export const logout = (redirectTo?: string) => {
  resetTabSession();
  return deleteSessionAction(redirectTo);
};

/**
 * Re-reads the cookie and compares it with the person this tab was started as. A missing cookie is reported as
 * "signed-out" and, unless `announceSignedOut` is false, shown to the user (it is expected when a session expires).
 */
export const checkSession = async ({ announceSignedOut = true }: { announceSignedOut?: boolean } = {}): Promise<SessionVerdict> => {
  if (!inBrowser() || !tab.identity()) return "ok"; // nothing to compare on a public page

  const { user, userType } = await getSessionData();
  if (!user) {
    if (announceSignedOut) useSessionNoticeStore.getState().showSignedOut();
    return "signed-out";
  }

  return observeSession(user, userType);
};

/** Automatic sign-out of this tab's own session (expired). Never ends a different person's session. */
export const endTabSession = async (redirectTo?: string) => {
  const identity = tab.identity();
  if (!identity) return deleteSessionAction(redirectTo);

  const result = await deleteSessionIfCurrent(identity, redirectTo);
  if (!result.deleted) await checkSession(); // the cookie is someone else's now: tell the user rather than logging them out
};

/** Automatic sign-out after a 401, for the session whose token the request carried. */
export const endSessionOfRequest = async (authorization?: string) => {
  const token = authorization?.replace(/^Bearer\s+/i, "");
  const identity = token ? identityOf(decodeJWT(token), tab.identity()?.userType) : null;

  if (!identity) return deleteSessionAction();
  await deleteSessionIfCurrent(identity);
};
