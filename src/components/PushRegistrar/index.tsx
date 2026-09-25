"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/Toast";
import { notificationKeys } from "@/queries/notification";
import { isPushSupported, listenForeground, registerPush } from "@/lib/push";

const DISMISS_STORAGE_KEY = "digenty.push.promptDismissedAt";
const DISMISS_DAYS = 14;

const isPromptDismissed = () => {
  try {
    const dismissedAt = Number(localStorage.getItem(DISMISS_STORAGE_KEY));
    return Boolean(dismissedAt) && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

const dismissPrompt = () => {
  try {
    localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
  } catch {
    // ignore
  }
};

export const PushRegistrar = () => {
  const queryClient = useQueryClient();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    (async () => {
      if (!(await isPushSupported())) return;

      if (Notification.permission === "granted") {
        await registerPush();
        unsubscribe = listenForeground(payload => {
          toast({ title: payload.title, description: payload.body, type: "info" });
          queryClient.invalidateQueries({ queryKey: notificationKeys.all });
        });
      } else if (Notification.permission === "default" && !isPromptDismissed()) {
        setShowPrompt(true);
      }
    })();

    return () => unsubscribe?.();
  }, [queryClient]);

  const handleEnable = async () => {
    setShowPrompt(false);
    const permission = await Notification.requestPermission();
    if (permission === "granted") await registerPush();
  };

  const handleDismiss = () => {
    dismissPrompt();
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="bg-bg-card border-border-default fixed right-4 bottom-4 z-50 flex w-80 items-start gap-3 rounded-xl border p-4 shadow-lg">
      <div className="flex-1">
        <p className="text-text-default text-sm font-medium">Turn on notifications</p>
        <p className="text-text-subtle mt-1 text-xs">Get notified here for updates, even when this tab isn&apos;t open.</p>
        <Button className="mt-3 h-8 text-xs" onClick={handleEnable}>
          Turn on notifications
        </Button>
      </div>
      <button onClick={handleDismiss} className="text-text-subtle hover:text-text-default shrink-0" aria-label="Dismiss">
        <X className="size-4" />
      </button>
    </div>
  );
};
