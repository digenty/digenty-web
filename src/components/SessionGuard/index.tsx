"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { checkSession, logout, resetTabSession } from "@/lib/session-client";
import type { SessionUserType } from "@/lib/session-identity";
import { useSessionNoticeStore } from "@/store/session";
import { useQueryClient } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// `focus` and `visibilitychange` both fire when a tab comes back to the front.
const CHECK_THROTTLE_MS = 1000;

const portalOf = (userType: SessionUserType | undefined, pathname: string): SessionUserType =>
  userType ?? (pathname.startsWith("/parents") || pathname.startsWith("/auth/parents") ? "PARENT" : "SCHOOL_STAFF");

const homeOf = (portal: SessionUserType) => (portal === "PARENT" ? "/parents" : "/staff");
const loginOf = (portal: SessionUserType) => (portal === "PARENT" ? "/auth/parents/login" : "/auth/staff");

/**
 * Every tab of a browser shares one login session. When another tab signs in as someone else (or signs out),
 * this tab keeps showing the original person but its requests are refused (see the axios interceptor). This
 * checks the session whenever the tab comes back to the front and, if it changed, asks the user what to do
 * instead of silently acting as the wrong person.
 */
export const SessionGuard = () => {
  const notice = useSessionNoticeStore(state => state.notice);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    let lastCheck = 0;

    const check = () => {
      if (document.visibilityState !== "visible") return;
      const now = Date.now();
      if (now - lastCheck < CHECK_THROTTLE_MS) return;
      lastCheck = now;
      void checkSession();
    };

    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, []);

  if (!notice) return null;

  const tabPortal = portalOf(undefined, pathname);
  const isChanged = notice.kind === "changed";
  const newPortal = portalOf(isChanged ? notice.userType : undefined, pathname);
  const name = isChanged ? (notice.name ?? "another user") : "";

  const continueAsNewPerson = () => {
    setIsPending(true);
    window.location.assign(homeOf(newPortal)); // a full reload, so the tab starts over as the person the cookie holds
  };

  const signOut = () => {
    setIsPending(true);
    queryClient.clear();
    void logout(loginOf(tabPortal));
  };

  const goToSignIn = () => {
    setIsPending(true);
    resetTabSession();
    window.location.assign(loginOf(tabPortal));
  };

  return (
    // Not dismissible: until the user chooses, this tab must not carry on as the person it is showing.
    <Dialog open onOpenChange={() => {}}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={event => event.preventDefault()}
        className="bg-bg-card border-none p-0 shadow-sm sm:max-w-120"
      >
        <DialogHeader className="bg-bg-card-subtle border-border-default rounded-t-xl border-b px-4 py-3 text-left">
          <DialogTitle className="text-text-default text-base font-semibold">
            {isChanged ? "Your session changed" : "You were signed out"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isChanged ? `This browser is now signed in as ${name}.` : "Your session ended in another tab."}
          </DialogDescription>
        </DialogHeader>

        <div className="text-text-subtle space-y-2 px-4 py-5 text-sm">
          {isChanged ? (
            <>
              <p>
                You signed in as <span className="text-text-default font-medium">{name}</span> in another tab. To keep your data safe, this tab has
                stopped sending requests.
              </p>
              <p className="text-text-muted text-xs">Signing out here also signs out the other tab, because both share one login.</p>
            </>
          ) : (
            <p>Your session ended in another tab, so this tab can no longer load or save anything.</p>
          )}
        </div>

        <DialogFooter className="border-border-default justify-between gap-2 border-t p-4">
          {isChanged ? (
            <>
              <Button
                disabled={isPending}
                onClick={signOut}
                className="bg-bg-state-soft! hover:bg-bg-state-soft! text-text-subtle h-8 border-none px-3 text-sm font-medium"
              >
                Sign out
              </Button>
              <Button
                disabled={isPending}
                onClick={continueAsNewPerson}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 px-3 text-sm font-medium"
              >
                Continue as {name}
              </Button>
            </>
          ) : (
            <Button
              disabled={isPending}
              onClick={goToSignIn}
              className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default ml-auto h-8 px-3 text-sm font-medium"
            >
              Go to sign in
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
