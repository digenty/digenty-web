import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import AnimateIn from "./AnimateIn";

const navLinks = [
  { label: "Why It Matters", href: "#why-it-matters" },
  { label: "Features", href: "#features" },
  { label: "Why Choose Us", href: "#why-choose-us" },
  { label: "Pricing", href: "#pricing" },
];

export default function Footer() {
  return (
    <footer className="px-4 pb-6 pt-2">
      <AnimateIn>
        <div className="mx-auto max-w-9xl overflow-hidden rounded-2xl bg-white shadow-[0px_1px_4px_0px_rgba(12,12,13,0.1)]">
          {/* Top row: logo + nav */}
          <div className="flex flex-col gap-4 px-8 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <Link href="/">
              <Image src="/icons/Logomark.svg" alt="Axis" width={65} height={27} />
            </Link>
            <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {navLinks.map(link => (
                <Link key={link.label} href={link.href} className="text-sm text-[#4e4e55] transition-colors duration-200 hover:text-[#111115]">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Divider */}
          <div className="mx-8 h-px bg-zinc-100 lg:mx-10" />

          {/* Bottom row: email only */}
          <div className="flex justify-end px-8 py-4 lg:px-10">
            <a
              href="mailto:support@axisbydigenty.com"
              className="inline-flex items-center gap-2 text-sm text-[#4e4e55] transition-colors duration-200 hover:text-[#111115]"
            >
              <Mail size={13} />
              support@axisbydigenty.com
            </a>
          </div>
        </div>
      </AnimateIn>
    </footer>
  );
}
