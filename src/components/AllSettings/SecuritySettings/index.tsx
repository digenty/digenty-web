"use client";

import CheckboxCircleFill from "@/components/Icons/CheckboxCircleFill";
import { CircleFill } from "@/components/Icons/CircleFill";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { deleteSession } from "@/app/actions/auth";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useSendChangePasswordOtp } from "@/hooks/queryHooks/useAuth";
import { useGetSecuritySettings, useLogoutAllSessions } from "@/hooks/queryHooks/useSecurity";
import { ActiveSession } from "@/api/security";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { ChangePasswordDialog } from "./ChangePasswordDialog";

const PASSWORD_DOTS = 10;

const getStrengthMeta = (strength: string | undefined) => {
  const normalized = (strength ?? "").toLowerCase().trim();
  if (!normalized) return { filled: 0, label: "Unknown", color: "var(--color-icon-default)", textClass: "text-text-muted" };
  if (normalized.includes("very") || normalized.includes("secure"))
    return { filled: 10, label: strength!, color: "var(--color-icon-success)", textClass: "text-text-success" };
  if (normalized.includes("strong")) return { filled: 7, label: strength!, color: "var(--color-icon-success)", textClass: "text-text-success" };
  if (normalized.includes("medium") || normalized.includes("fair") || normalized.includes("good"))
    return { filled: 5, label: strength!, color: "var(--color-icon-warning)", textClass: "text-text-warning" };
  if (normalized.includes("weak")) return { filled: 3, label: strength!, color: "var(--color-icon-destructive)", textClass: "text-text-destructive" };
  return { filled: PASSWORD_DOTS, label: strength!, color: "var(--color-icon-success)", textClass: "text-text-success" };
};

export const SecuritySettings = () => {
  const [open, setOpen] = useState(false);

  useBreadcrumb([
    { label: "Settings", url: "/staff/settings" },
    { label: "Security", url: "/staff/settings/security" },
  ]);

  const { data, isPending: isLoading } = useGetSecuritySettings();
  const { mutate: sendOtp, isPending: isSendingOtp } = useSendChangePasswordOtp();
  const { mutate: logoutAll, isPending: isLoggingOutAll } = useLogoutAllSessions();

  const strengthMeta = getStrengthMeta(data?.data?.passwordStrength);
  const sessions = data?.data?.activeSessions ?? [];

  const handleChangePassword = () => {
    sendOtp(undefined, {
      onSuccess: response => {
        toast({ title: "OTP sent", description: response?.message ?? "A code has been sent to your email", type: "success" });
        setOpen(true);
      },
      onError: error => {
        toast({
          title: typeof error === "string" ? error : (error?.message ?? "Something went wrong"),
          description: "Could not send OTP",
          type: "error",
        });
      },
    });
  };

  const handleLogoutAll = () => {
    logoutAll(undefined, {
      onSuccess: async () => {
        toast({ title: "Signed out", description: "You have been logged out of all sessions", type: "success" });
        await deleteSession();
      },
      onError: error => {
        toast({
          title: typeof error === "string" ? error : (error?.message ?? "Something went wrong"),
          description: "Could not log out of all sessions",
          type: "error",
        });
      },
    });
  };

  return (
    <div className="mx-auto my-6 flex w-full items-center justify-center md:max-w-151">
      <div className="flex w-full flex-col gap-6">
        <div className="text-text-default text-xl font-semibold">Security</div>

        <div className="border-border-default flex items-center justify-between gap-4 border-b pb-4">
          <Label className="text-text-default text-sm font-medium">Password</Label>
          <div className="flex items-center gap-1">
            {isLoading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              <>
                <div className="flex gap-1">
                  {Array.from({ length: PASSWORD_DOTS }).map((_, i) => (
                    <CircleFill key={i} fill={i < strengthMeta.filled ? strengthMeta.color : "var(--color-icon-default)"} />
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <CheckboxCircleFill fill={strengthMeta.color} className="size-3" />
                  <div className={`text-sm font-medium ${strengthMeta.textClass}`}>{strengthMeta.label}</div>
                </div>
              </>
            )}
          </div>
          <Button
            disabled={isSendingOtp}
            onClick={handleChangePassword}
            className="border-border-darker text-text-default bg-bg-state-secondary! h-8 rounded-md border disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSendingOtp && <Spinner className="text-text-default" />} Change Password
          </Button>
        </div>

        <div className="text-text-default border-border-default border-b pb-4 text-lg font-semibold">Active Sessions</div>

        {isLoading ? (
          <>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </>
        ) : sessions.length === 0 ? (
          <div className="text-text-muted text-sm">No active sessions found.</div>
        ) : (
          sessions.map((session, index) => (
            <SessionRow key={session.sessionId} session={session} isCurrent={index === 0} isLast={index === sessions.length - 1} />
          ))
        )}

        <Button
          disabled={isLoggingOutAll || sessions.length === 0}
          onClick={handleLogoutAll}
          className="border-border-darker text-text-default bg-bg-state-secondary! mt-5 h-8 w-fit rounded-md border disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOutAll && <Spinner className="text-text-default" />} Log out of all sessions
        </Button>
      </div>

      <ChangePasswordDialog open={open} setOpen={setOpen} />
    </div>
  );
};

const SessionRow = ({ session, isCurrent, isLast }: { session: ActiveSession; isCurrent: boolean; isLast: boolean }) => {
  const lastActive = new Date(session.lastActiveAt);
  const isValidDate = !isNaN(lastActive.getTime());

  return (
    <div className={isLast ? "" : "border-border-default border-b pb-4"}>
      <div className="text-text-default text-md font-medium">
        {session.deviceName} · {session.browser}
      </div>
      <div className="text-text-muted text-sm font-medium">
        {isCurrent ? "Current session" : isValidDate ? `Last active · ${formatDistanceToNow(lastActive, { addSuffix: true })}` : "—"}
      </div>
    </div>
  );
};
