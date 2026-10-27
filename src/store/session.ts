import { create } from "zustand";
import type { SessionUserType } from "@/lib/session-identity";

// What the open tab has to tell the user about the shared login session.
export type SessionNotice = { kind: "changed"; name?: string; userType?: SessionUserType } | { kind: "signed-out" };

interface SessionNoticeState {
  notice: SessionNotice | null;
  showChanged: (who: { name?: string; userType?: SessionUserType }) => void;
  showSignedOut: () => void;
  clear: () => void;
}

export const useSessionNoticeStore = create<SessionNoticeState>()(set => ({
  notice: null,
  // Re-reported on every blocked request, so don't re-render when nothing actually changed.
  showChanged: who =>
    set(state => (state.notice?.kind === "changed" && state.notice.name === who.name ? state : { notice: { kind: "changed", ...who } })),
  showSignedOut: () => set(state => (state.notice?.kind === "signed-out" ? state : { notice: { kind: "signed-out" } })),
  clear: () => set(state => (state.notice ? { notice: null } : state)),
}));
