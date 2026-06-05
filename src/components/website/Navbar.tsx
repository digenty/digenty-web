"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Why It Matters", href: "#why-it-matters" },
  { label: "Features", href: "#features" },
  { label: "Why Choose Us", href: "#why-choose-us" },
  { label: "Pricing", href: "#pricing" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 px-4 py-3">
      <div className="max-w-9xl mx-auto flex items-center justify-between rounded-2xl border border-zinc-200/60 bg-white/90 px-6 py-3.5 shadow-sm backdrop-blur-md">
        <Link href="/" className="shrink-0">
          <Image src="/icons/Logomark.svg" width={65} height={27} alt="Axis" />
        </Link>

        <div className="hidden items-center gap-0.5 md:flex">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-[#4e4e55] transition-colors duration-200 hover:bg-zinc-100 hover:text-[#111115]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/auth/staff"
            className="rounded-full px-4 py-2 text-sm font-medium text-[#4e4e55] transition-colors duration-200 bg-zinc-100 hover:text-[#111115]"
          >
            Use Demo Account
          </Link>
          <Link
            href="/auth/staff?step=signup"
            className="rounded-full bg-[#437dfc] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-600 hover:shadow-md"
          >
            Get Started
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-[#111115] transition-colors duration-200 hover:bg-zinc-100 md:hidden"
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-1.5 flex max-w-7xl flex-col gap-1 rounded-2xl border border-zinc-200/60 bg-white/95 px-4 py-4 shadow-lg backdrop-blur-md md:hidden">
          {navLinks.map(link => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#4e4e55] transition-colors duration-200 hover:bg-zinc-50 hover:text-[#111115]"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-2 flex flex-col gap-2 border-t border-zinc-100 pt-3">
            <Link
              href="/auth/staff"
              onClick={() => setMobileOpen(false)}
              className="rounded-full bg-zinc-100 px-4 py-2.5 text-center text-sm font-medium text-[#4e4e55] transition-colors hover:bg-zinc-200"
            >
              Use Demo Account
            </Link>
            <Link
              href="/auth/staff?step=signup"
              onClick={() => setMobileOpen(false)}
              className="rounded-full bg-[#437dfc] px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-600"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
