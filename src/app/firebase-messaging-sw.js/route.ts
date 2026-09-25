import { NextResponse } from "next/server";
import { version as FIREBASE_SDK_VERSION } from "firebase/package.json";

// Served at /firebase-messaging-sw.js. Generated at request time (not a static public/ file)
// because the Firebase web config has to be inlined with real env var values, and public/
// assets are served as-is with no templating. Registered from the client (src/lib/push.ts)
// with a non-root scope so it never competes with the app's PWA service worker (src/app/sw.ts,
// scope "/").
export function GET() {
  const script = `
importScripts("https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/${FIREBASE_SDK_VERSION}/firebase-messaging-compat.js");

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const targetUrl = "/staff";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.startsWith(self.location.origin) && "focus" in client) {
          if ("navigate" in client) client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    }),
  );
});

firebase.initializeApp({
  apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? ""}",
  authDomain: "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? ""}",
  projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ""}",
  messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? ""}",
  appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? ""}",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  const data = payload.data || {};
  self.registration.showNotification(data.title || "New notification", {
    body: data.body || "",
    icon: "/icons/pwa/icon-192.png",
    tag: "notification-" + (data.notificationId || Date.now()),
    data,
  });
});
`.trimStart();

  return new NextResponse(script, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
