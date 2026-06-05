import Link from "next/link";
import { Building2, BarChart2, Users, CircleUser, Sparkles, CircleQuestionMark } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AnimateIn from "./AnimateIn";

const schoolTypes: { icon: LucideIcon; iconBg: string; label: string; desc: string; features: string[] }[] = [
  {
    icon: Building2,
    iconBg: "bg-gradient-to-br from-violet-600 to-purple-700",
    label: "Private Schools",
    desc: "From nursery to secondary, Manage all levels with one system",
    features: ["CBT Platform", "Parent Portal", "Attendance Management", "Billing and Invoice"],
  },
  {
    icon: BarChart2,
    iconBg: "bg-gradient-to-br from-teal-600 to-cyan-700",
    label: "School Chains",
    desc: "Manage multiple branches from one central dashboard",
    features: ["Multi-Branch Support", "Centralized Data", "Bulk Student Upload Reporting", "Branch Comparisons"],
  },
  {
    icon: Users,
    iconBg: "bg-gradient-to-br from-pink-600 to-rose-600",
    label: "Growing Schools",
    desc: "Scale effortlessly with an all-in-one solution with flexibility",
    features: ["Easy Onboarding", "Flexible Pricing", "Growth Analytics", "Unlimited Students"],
  },
];

function GiraffeCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#f5f0d0] px-8 py-12 text-center">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-25" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <pattern id="giraffe-spots" x="0" y="0" width="130" height="130" patternUnits="userSpaceOnUse">
            <polygon points="18,4 42,2 56,16 50,38 28,42 8,28" fill="#c2a84e" />
            <polygon points="72,8 95,5 110,20 103,44 80,48 62,33" fill="#c2a84e" />
            <polygon points="4,62 28,57 42,72 36,95 12,98 -4,82" fill="#c2a84e" />
            <polygon points="62,60 86,54 100,70 93,93 68,97 50,80" fill="#c2a84e" />
            <polygon points="100,68 122,62 134,78 127,100 104,104 88,90" fill="#c2a84e" />
            <polygon points="28,98 52,93 66,108 60,126 36,128 18,116" fill="#c2a84e" />
            <polygon points="86,96 108,90 122,105 115,124 92,127 74,114" fill="#c2a84e" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#giraffe-spots)" />
      </svg>
      <div className="relative z-10 flex flex-col items-center gap-4">
        <h3 className="text-lg font-bold text-[#111115]">Explore Axis for Yourself</h3>
        <p className="max-w-md text-sm leading-relaxed text-[#4e4e55]">
          Instantly access a live demo—see how easy it is to manage exams, results, and more.
        </p>
        <Link
          href="/auth/staff"
          className="inline-flex items-center gap-2 rounded-full bg-[#437dfc] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-600 hover:shadow-md active:scale-[0.98]"
        >
          Try the Demo Now
        </Link>
      </div>
    </div>
  );
}

export default function WhoWeAreSection() {
  return (
    <section id="why-choose-us" className="px-4 py-12 lg:py-16">
      <div className="mx-auto flex max-w-9xl flex-col gap-10">
        {/* Header */}
        <AnimateIn>
          <div className="flex flex-col gap-3">
            <span className="bg-bg-basic-sky-contrast inline-flex w-fit items-center gap-2 rounded-full px-2 py-1.5 text-xs font-medium text-[#4e4e55]">
              <CircleQuestionMark
                size={12}
                className="size-5 rounded-full bg-[linear-gradient(to_right,#00EEFF_0%,#50BCFF_50%,#A9A5FF_100%)] p-1 text-black"
                // fill="black"
              />{" "}
              Who Is It for?
            </span>
            <h2 className="max-w-2xl text-3xl leading-tight font-bold text-[#111115] sm:text-4xl">
              Whether you&apos;re a small school or large chain, Axis adapts to your needs
            </h2>
          </div>
        </AnimateIn>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {schoolTypes.map((type, i) => (
            <AnimateIn key={type.label} delay={i * 120}>
              <div className="flex h-full flex-col gap-5 rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${type.iconBg}`}>
                  <type.icon size={20} strokeWidth={2} className="text-white" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-bold text-[#111115]">{type.label}</h3>
                  <p className="text-sm leading-relaxed text-[#4e4e55]">{type.desc}</p>
                </div>
                <div className="h-px w-full bg-zinc-100" />
                <ul className="flex flex-col gap-2.5">
                  {type.features.map(f => (
                    <li key={f} className="text-sm text-[#4e4e55]">
                      • {f}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          ))}
        </div>

        <AnimateIn delay={100}>
          <GiraffeCTA />
        </AnimateIn>
      </div>
    </section>
  );
}
