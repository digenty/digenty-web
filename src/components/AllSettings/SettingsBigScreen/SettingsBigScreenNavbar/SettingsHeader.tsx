"use client";

import { usePathname } from "next/navigation";
import React from "react";
import { SETTINGS_NAV } from "../../settingsConstants";
import Link from "next/link";

export const SettingsHeader = () => {
  const pathname = usePathname();

  return (
    <nav className="border-border-default hidden h-14 items-center justify-between gap-2 border-b px-8 py-3 md:flex">
      {SETTINGS_NAV.map(item => {
        const isActive = pathname === item.url || pathname.startsWith(item.url + "/");

        return (
          <Link
            key={item.url}
            href={item.url}
            className={`hover:bg-bg-state-soft-hover text-text-muted flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all ${
              isActive ? "bg-bg-state-soft text-text-default" : "bg-transparent"
            }`}
          >
            {item.icon && <item.icon className="h-4 w-4" fill="var(--color-icon-default-muted)" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
