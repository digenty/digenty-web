import type { Metadata } from "next";
import { Toaster } from "sonner";
import { inter } from "./fonts";
import { TanstackProvider } from "./providers/Tanstack";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "Digenty",
  description: "Your favourite management app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <TanstackProvider>
          {children}
          <Toaster position="bottom-right" richColors closeButton />
        </TanstackProvider>
      </body>
    </html>
  );
}
