import type { Metadata, Viewport } from "next";
import { SerwistProvider } from "@serwist/turbopack/react";
import { Toaster } from "sonner";
import { InstallPrompt } from "@/components/InstallPrompt";
import { inter } from "./fonts";
import { TanstackProvider } from "./providers/Tanstack";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Axis",
  description: "Your favourite school management app",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Axis",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#2147DD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SerwistProvider swUrl="/serwist/sw.js">
          <TanstackProvider>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
            <InstallPrompt />
          </TanstackProvider>
        </SerwistProvider>
      </body>
    </html>
  );
}
