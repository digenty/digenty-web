"use client";

import { SettingsMobileNav } from "../SettingsMobileView";
import { SettingsHeader } from "./SettingsBigScreenNavbar/SettingsHeader";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SettingsBigScreenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isRoot = pathname === "/settings" || pathname === "/settings/";

  return (
    <>
      <div className="hidden lg:block">
        <SettingsHeader />

        <section>{children}</section>
      </div>

      <div className="block lg:hidden">
        {isRoot ? (
          <div className="p-4">
            <SettingsMobileNav />
          </div>
        ) : (
          <div className="p-4">
            <div className="mb-4 hidden">
              <Link href="/settings" className="text-primary-600 inline-flex items-center gap-2 text-sm">
                <span aria-hidden className="text-lg">
                  ←
                </span>
                <span>Back</span>
              </Link>
            </div>

            <section>{children}</section>
          </div>
        )}
      </div>
    </>
  );
}
