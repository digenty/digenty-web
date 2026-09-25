import { getApp, getApps, initializeApp } from "firebase/app";
import { deleteToken, getMessaging, getToken, isSupported, onMessage, type Messaging } from "firebase/messaging";
import { registerDevice, unregisterDevice } from "@/api/push";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

// A non-root scope so this worker never competes with the app's PWA service worker
// (src/app/sw.ts, registered at scope "/"). Background push delivery and notificationclick
// don't depend on this worker controlling page navigation, so a narrow scope costs nothing.
const SW_SCOPE = "/firebase-cloud-messaging-push-scope/";
const TOKEN_STORAGE_KEY = "digenty.push.token";

type ForegroundPushPayload = {
  notificationId: string;
  type: string;
  title: string;
  body: string;
};

export const isPushConfigured = () => Object.values(firebaseConfig).every(Boolean) && !!vapidKey;

let loggedMisconfigured = false;

export const isPushSupported = async () => {
  if (!isPushConfigured()) {
    if (process.env.NODE_ENV === "development" && !loggedMisconfigured) {
      loggedMisconfigured = true;
      console.info("[push] Firebase env vars are not configured — push notifications are disabled.");
    }
    return false;
  }

  if (typeof window === "undefined" || !("Notification" in window) || !("serviceWorker" in navigator)) {
    return false;
  }

  return isSupported();
};

let messagingInstance: Messaging | null = null;

const getMessagingInstance = () => {
  if (!messagingInstance) {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    messagingInstance = getMessaging(app);
  }
  return messagingInstance;
};

const readStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
};

const storeToken = (token: string) => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch {
    // best-effort — a failed write just means we re-register next time
  }
};

const clearStoredToken = () => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // ignore
  }
};

export const registerPush = async () => {
  if (!(await isPushSupported())) return;

  const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { scope: SW_SCOPE });
  const messaging = getMessagingInstance();
  const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: registration });
  if (!token) return;

  try {
    await registerDevice({ token, platform: "WEB", app: "DIGENTY_WEB", userAgent: navigator.userAgent });
    storeToken(token);
  } catch (error) {
    // Backend's guard for accounts that can't receive push (student/system tokens) — nothing to
    // surface to the user, this account just never gets registered.
    if ((error as { code?: string })?.code === "INVALID_REQUEST") return;
    throw error;
  }
};

export const unregisterPush = async () => {
  const token = readStoredToken();
  if (!token) return;

  const cleanup = (async () => {
    try {
      await unregisterDevice(token);
      await deleteToken(getMessagingInstance());
    } catch {
      // best-effort — logout must never be blocked by push cleanup
    } finally {
      clearStoredToken();
    }
  })();

  await Promise.race([cleanup, new Promise<void>(resolve => setTimeout(resolve, 3000))]);
};

export const listenForeground = (cb: (payload: ForegroundPushPayload) => void) => {
  if (!isPushConfigured()) return () => {};

  return onMessage(getMessagingInstance(), payload => {
    const data = payload.data ?? {};
    cb({
      notificationId: data.notificationId ?? "",
      type: data.type ?? "SYSTEM",
      title: data.title ?? "",
      body: data.body ?? "",
    });
  });
};
