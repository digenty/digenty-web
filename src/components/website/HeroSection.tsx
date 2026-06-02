import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardList,
  Calendar,
  UserPlus,
  Receipt,
  Wallet,
  Star,
  TrendingDown,
  Package,
  BarChart2,
  CreditCard,
  MessageSquare,
  Globe,
  Monitor,
  LogOut,
  FilePlus,
  Bell,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import AnimateIn from "./AnimateIn";

type SidebarItem = { icon: LucideIcon; label: string; active?: boolean };
type SidebarSection = { sectionLabel?: string; items: SidebarItem[] };

const sidebarSections: SidebarSection[] = [
  {
    items: [
      { icon: LayoutDashboard, label: "Dashboard", active: true },
      { icon: Users, label: "Student & Parent Record" },
      { icon: BookOpen, label: "Classes & Subjects" },
      { icon: ClipboardList, label: "CBT" },
      { icon: Calendar, label: "Attendance" },
      { icon: UserPlus, label: "Admission Management" },
    ],
  },
  {
    sectionLabel: "Finance",
    items: [
      { icon: Receipt, label: "Invoices" },
      { icon: Wallet, label: "Fees" },
      { icon: TrendingDown, label: "Expenses" },
      { icon: Package, label: "Stock" },
      { icon: CreditCard, label: "Fee Collection" },
      { icon: BarChart2, label: "Finance Report" },
    ],
  },
  {
    sectionLabel: "Communication & Portal",
    items: [
      { icon: MessageSquare, label: "Communications" },
      { icon: Globe, label: "Website Customization" },
      { icon: Globe, label: "Domain" },
      { icon: Monitor, label: "Website Overview" },
    ],
  },
];

const chartBars = [55, 80, 45, 90, 65, 50, 85, 60, 75, 40, 88, 70];

function DashboardMockup() {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <Image src="/icons/Logomark.svg" width={45} height={27} alt="Axis" />
        </div>
        <span className="text-[11px] font-semibold text-[#111115]">Dashboard</span>
        <div className="h-2 w-8 rounded bg-zinc-200" />
      </div>

      <div className="flex h-110 lg:h-158">
        {/* Sidebar */}
        <div className="flex w-40 shrink-0 flex-col gap-5 overflow-y-auto border-r border-zinc-100 bg-zinc-50 px-2 py-2">
          {sidebarSections.map((section, si) => (
            <div key={si} className="mb-1">
              {section.sectionLabel && (
                <p className="px-2 pt-2 pb-0.5 text-[8px] font-semibold tracking-wider text-zinc-400 uppercase">{section.sectionLabel}</p>
              )}
              {section.items.map(item => (
                <div
                  key={item.label}
                  className={`flex items-center gap-1.5 rounded-md px-2 py-[3px] ${item.active ? "bg-[#437dfc]/10 text-[#437dfc]" : "text-zinc-400"}`}
                >
                  <item.icon size={10} strokeWidth={2} />
                  <span className="text-[9px] leading-tight font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          ))}

          {/* Setup Guide */}
          <div className="mt-auto px-2 pt-2 pb-1">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-[#111115]">Setup Guide</span>
              <span className="text-[9px] font-semibold text-zinc-400">50%</span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-zinc-200">
              <div className="bg-bg-basic-emerald-strong h-full w-1/2 rounded-full" />
            </div>
          </div>

          {/* Sign Out */}
          <div className="mt-1 flex items-center gap-1.5 px-2 py-1.5 text-zinc-400">
            <LogOut size={10} />
            <span className="text-[9px]">Sign Out</span>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden p-4">
          <p className="text-xs font-semibold text-[#111115]">Overview</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Fees Collected", value: "₦200,280", tag: "+54%", tagCls: "text-green-700 bg-green-50" },
              { label: "Outstanding Fees", value: "₦50,000", tag: "+100%", tagCls: "text-[#437dfc] bg-blue-50" },
              { label: "Students", value: "1,240", tag: "+12%", tagCls: "text-violet-700 bg-violet-50" },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-zinc-100 bg-white p-2.5 shadow-sm">
                <p className="text-[9px] text-zinc-500">{s.label}</p>
                <p className="mt-0.5 text-[11px] font-bold text-[#111115]">{s.value}</p>
                <span className={`mt-1 inline-block rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${s.tagCls}`}>{s.tag}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Create Invoice", icon: FilePlus },
              { label: "Send Reminders", icon: Bell },
              { label: "Add Student", icon: UserPlus },
            ].map(a => (
              <div
                key={a.label}
                className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-medium text-zinc-600 shadow-sm"
              >
                <a.icon size={10} strokeWidth={2} />
                {a.label}
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="flex flex-1 flex-col rounded-xl border border-zinc-100 bg-white p-3">
            <div className="mb-2 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-zinc-500">Class Payment Completion</p>
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1 text-[9px] text-zinc-400">
                    <span className="inline-block h-2 w-2 rounded-sm bg-[#437dfc]" />
                    Paid
                  </span>
                  <span className="flex items-center gap-1 text-[9px] text-zinc-400">
                    <span className="inline-block h-2 w-2 rounded-sm bg-zinc-200" />
                    Unpaid
                  </span>
                </div>
              </div>
              <div className="flex w-fit items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5">
                <span className="text-[9px] text-zinc-600">24/25 Third Term</span>
                <ChevronDown size={9} className="text-zinc-400" />
              </div>
            </div>
            <div className="relative flex flex-1 items-end gap-1 overflow-hidden pb-1">
              {[25, 50, 75, 100].map(pct => (
                <div key={pct} className="pointer-events-none absolute right-0 left-0 border-b border-zinc-100" style={{ bottom: `${pct}%` }} />
              ))}
              {chartBars.map((h, i) => (
                <div key={i} className="relative z-10 flex flex-1 flex-col gap-0.5">
                  <div className="w-full rounded-t-sm bg-zinc-200" style={{ height: `${(100 - h) * 0.8}px` }} />
                  <div className="w-full rounded-t-sm bg-[#437dfc]" style={{ height: `${h * 3}px` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const stats = [
  { number: "1,000+", label: "Students Enrolled", bg: "bg-[#FEF3C7]" },
  { number: "200+", label: "Teachers Onboarded", bg: "bg-[#D9F99D]" },
  { number: "50+", label: "Parents Onboarded", bg: "bg-[#f0faf8]" },
];

export default function HeroSection() {
  return (
    <section className="px-4 pt-2 pb-6">
      <div className="max-w-9xl mx-auto overflow-hidden rounded-2xl bg-white shadow-[0px_1px_4px_0px_rgba(12,12,13,0.1)]">
        <div className="flex flex-col items-stretch lg:flex-row">
          {/* Left */}
          <div className="flex flex-1 flex-col justify-center gap-8 px-8 py-12 lg:px-12 lg:py-20 lg:pr-6">
            <AnimateIn>
              <div className="flex flex-col gap-5">
                <h1 className="text-4xl leading-tight font-bold tracking-tight text-[#111115] sm:text-5xl lg:text-[3.5rem]">
                  Manage your school
                  <br className="hidden sm:block" /> with ease, ditch
                  <br className="hidden sm:block" /> the chaos
                </h1>
                <p className="max-w-[460px] text-base leading-relaxed text-[#4e4e55]">
                  Manage results, CBT exams, fees, attendance, and parent communication in one simple system built for modern schools.
                </p>
              </div>
            </AnimateIn>

            <AnimateIn delay={150}>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link
                  href="/auth/staff?step=signup"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#437dfc] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-600 hover:shadow-md active:scale-[0.98] sm:w-auto"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/staff"
                  className="w-full rounded-full border border-zinc-200 px-5 py-2.5 text-center text-sm font-medium text-[#111115] transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 sm:w-auto"
                >
                  Use Demo Account
                </Link>
              </div>
            </AnimateIn>

            <AnimateIn delay={280}>
              <div className="grid grid-cols-1 gap-3 overflow-hidden md:grid-cols-3">
                {stats.map(s => (
                  <div key={s.label} className={`flex flex-col gap-1 rounded-xl px-4 py-4 ${s.bg}`}>
                    <span className="text-md font-semibold text-[#111115] sm:text-2xl">{s.number}</span>
                    <span className="text-xs leading-snug text-[#6f6f77] sm:text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>

          <AnimateIn
            from="right"
            delay={200}
            className="flex flex-1 items-end justify-center pt-8 pb-0 pl-6 lg:w-[55%] lg:flex-none lg:items-end lg:justify-end lg:pt-10 lg:pr-0 lg:pl-8"
          >
            <div className="relative w-full">
              {/* Mobile: dashboard.png with badge at bottom-right */}
              <div className="relative block lg:hidden">
                <Image src="/website/dashboard.png" alt="Axis Dashboard" width={800} height={500} className="w-full rounded-2xl" />
                <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-2 rounded-2xl border-2 border-[#facc15] bg-[#0a2e28] px-3.5 py-2 shadow-lg">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="text-yellow-400" fill="#facc15" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-white">Trusted by schools</span>
                </div>
              </div>

              {/* Desktop: dashboard mockup with badge at top-left */}
              <div className="hidden lg:block">
                <div className="absolute -top-1 -left-5 z-10 flex flex-col gap-2 rounded-2xl border-2 border-[#facc15] bg-[#0a2e28] px-3.5 py-2 shadow-lg">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} className="text-yellow-400" fill="#facc15" />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-white">Trusted by schools</span>
                </div>
                <DashboardMockup />
              </div>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
