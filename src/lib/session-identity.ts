// Who a login session belongs to, and how a browser tab tells that the shared session cookie was swapped
// for someone else's by another tab. Pure and framework-free so it can run on the server and the client.

export type SessionUserType = "SCHOOL_STAFF" | "PARENT";

// `userType` comes from the `session_type` cookie, so it is missing for sessions that started before it was recorded.
export type SessionIdentity = { id: number; email?: string; userType?: SessionUserType };

type IdentitySource = { id?: number | null; email?: string | null };

// Error code of the error the axios layer raises instead of sending a request as someone the tab doesn't show.
export const SESSION_CHANGED_CODE = "SESSION_CHANGED";

export const identityOf = (user: IdentitySource | null | undefined, userType?: SessionUserType): SessionIdentity | null => {
  if (user?.id == null) return null;
  const email = user.email?.trim().toLowerCase();
  return { id: user.id, ...(email && { email }), ...(userType && { userType }) };
};

export const isSameIdentity = (a: SessionIdentity, b: SessionIdentity): boolean => {
  if (a.id !== b.id) return false;
  // Ids are only unique within a user type, and an email can be edited, so once both sides know their type it decides.
  if (a.userType && b.userType) return a.userType === b.userType;
  // Older sessions don't know their type: a staff member and a parent can share an id, so fall back to the email.
  return !a.email || !b.email || a.email === b.email;
};

// May a re-issued token overwrite the session cookie? Never resurrect a session that was signed out meanwhile,
// and never replace the session of a different person (another tab signed in as them after this request started).
export const canReplaceSession = (
  current: SessionIdentity | null | undefined,
  hasCurrentSession: boolean,
  next: SessionIdentity | null | undefined,
): boolean => {
  if (!hasCurrentSession) return false;
  if (current && next && !isSameIdentity(current, next)) return false;
  return true;
};

export type TabVerdict = "ok" | "changed";

// Remembers the person this browser tab was started as. Every tab shares one session cookie, so another tab can
// replace it at any time; the first identity seen is kept until `reset()` (this tab logging in or out on purpose).
export const createTabTracker = <User>() => {
  let session: { identity: SessionIdentity; user: User } | null = null;

  return {
    observe(identity: SessionIdentity | null, user: User): TabVerdict {
      if (!identity) return "ok"; // can't tell who this is, so don't block anything
      if (!session) {
        session = { identity, user };
        return "ok";
      }
      if (!isSameIdentity(session.identity, identity)) return "changed";

      // Same person (e.g. a refreshed token with updated permissions): keep the newest user data.
      const userType = identity.userType ?? session.identity.userType;
      session = { identity: { ...identity, ...(userType && { userType }) }, user };
      return "ok";
    },
    reset() {
      session = null;
    },
    identity: (): SessionIdentity | null => session?.identity ?? null,
    user: (): User | null => session?.user ?? null,
  };
};
