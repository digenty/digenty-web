"use client";

import { useEffect, useState } from "react";
import { Close, Download2, ShareBox } from "@digenty/icons";
import { Button } from "../ui/button";

const DISMISSED_KEY = "axis-install-prompt-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const isStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches || (window.navigator as Navigator & { standalone?: boolean }).standalone === true;

const isIos = () => {
  const ua = window.navigator.userAgent;
  const isIDevice = /iPad|iPhone|iPod/.test(ua);
  const isIpadOS = window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1;
  return isIDevice || isIpadOS;
};

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISSED_KEY)) return;

    if (isIos()) {
      setPlatform("ios");
      setVisible(true);
      return;
    }

    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform("android");
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, "1");
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") setVisible(false);
    else dismiss();
  };

  if (!visible) return null;

  return (
    <div className="border-border-default bg-bg-card fixed inset-x-4 top-20 z-50 flex items-start gap-3 rounded-xl border p-4 shadow-lg md:inset-x-auto md:right-4 md:w-96">
      <div className="bg-bg-state-soft flex size-10 shrink-0 items-center justify-center rounded-full">
        {platform === "ios" ? (
          <ShareBox className="size-5" fill="var(--color-icon-default-subtle)" />
        ) : (
          <Download2 className="size-5" fill="var(--color-icon-default-subtle)" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-text-default text-sm font-semibold">Install Axis</p>
        {platform === "ios" ? (
          <p className="text-text-muted mt-1 text-xs leading-relaxed">
            Tap <ShareBox className="mx-0.5 inline size-3.5 align-text-bottom" fill="currentColor" /> in Safari, then &quot;Add to Home Screen&quot;
            for quick, app-like access.
          </p>
        ) : (
          <p className="text-text-muted mt-1 text-xs leading-relaxed">Add Axis to your home screen for quick, app-like access.</p>
        )}

        {platform === "android" && (
          <Button size="sm" className="mt-3" onClick={handleInstall}>
            Install
          </Button>
        )}
      </div>

      <button onClick={dismiss} className="text-text-hint hover:text-text-default shrink-0" aria-label="Dismiss install prompt">
        <Close className="size-4" />
      </button>
    </div>
  );
};
