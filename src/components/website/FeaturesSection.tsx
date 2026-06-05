import {
  Receipt,
  Wallet,
  BarChart2,
  Package,
  Megaphone,
  TrendingUp,
  User,
  Building2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Layers,
  Pencil,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import AnimateIn from "./AnimateIn";

const featureTiles: { icon: LucideIcon; label: string; iconColor: string; iconBg: string }[] = [
  { icon: Receipt, label: "Fee Management", iconColor: "text-violet-500", iconBg: "bg-violet-50" },
  { icon: Wallet, label: "Fees Collection", iconColor: "text-emerald-500", iconBg: "bg-emerald-50" },
  { icon: BarChart2, label: "Expense Records", iconColor: "text-indigo-500", iconBg: "bg-indigo-50" },
  { icon: Package, label: "Stock Management", iconColor: "text-purple-500", iconBg: "bg-purple-50" },
  { icon: Megaphone, label: "Parent Communication", iconColor: "text-cyan-500", iconBg: "bg-cyan-50" },
  { icon: TrendingUp, label: "Teacher Portal", iconColor: "text-amber-500", iconBg: "bg-amber-50" },
  { icon: User, label: "Student Portal", iconColor: "text-teal-500", iconBg: "bg-teal-50" },
  { icon: Building2, label: "Admission Management", iconColor: "text-blue-500", iconBg: "bg-blue-50" },
];

function CBTPreview() {
  return (
    <div>
      <Image src="/website/Feature Image.png" alt="CBT Exam Preview" width={400} height={300} className="w-full object-cover" />
    </div>
  );
}

function ParentPortalPreview() {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {/* Outstanding Fees */}
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-rose-50">
            <AlertCircle size={11} className="text-rose-500" />
          </div>
          <span className="text-[10px] font-medium text-zinc-500">Outstanding Fees</span>
        </div>
        <p className="text-lg font-bold text-[#111115]">₦30,000</p>
        <button className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#437dfc] py-2 text-xs font-semibold text-white">
          Pay now <ArrowRight size={11} />
        </button>
      </div>
      {/* Academic Result */}
      <div className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-emerald-50">
            <CheckCircle2 size={11} className="text-emerald-500" />
          </div>
          <span className="text-[10px] font-medium text-zinc-500">Academic Result</span>
        </div>
        <p className="text-xs leading-snug font-semibold text-[#111115]">Second Term Result Available</p>
        <button className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 py-2 text-xs font-medium text-[#111115]">
          View Results <ArrowRight size={11} />
        </button>
      </div>
    </div>
  );
}

function StudentRecordPreview() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-zinc-200 bg-white">
      {/* Mobile: static image */}
      <div className="block sm:hidden">
        <Image src="/website/Info Card Container.png" alt="Student record preview" width={800} height={300} className="w-full" />
      </div>

      {/* Desktop: coded UI */}
      <div className="hidden sm:block">
        <div className="flex items-start justify-between border-b border-zinc-100 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-200">
              <User size={16} className="text-zinc-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#111115]">Damilare John</span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">Prefect</span>
              </div>
              <p className="text-xs text-zinc-500">JSS 1 A</p>
              <p className="text-xs text-zinc-400">GFA/2023/01045</p>
            </div>
          </div>
          <button className="flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs text-zinc-500 hover:bg-zinc-50">
            <Pencil size={10} />
            Edit Student Information
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 p-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500">Status:</span>
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-zinc-500">Linked Parents:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <User size={11} className="text-zinc-400" />
                <span className="text-xs text-[#111115]">Ebony John</span>
              </div>
              <div className="flex items-center gap-1">
                <User size={11} className="text-zinc-400" />
                <span className="text-xs text-[#111115]">Samson John</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckDot({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#437dfc]/15">
        <span className="h-2 w-2 rounded-full bg-[#1C547E]" />
      </span>
      <span className="text-sm text-[#111115]">{label}</span>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-12 lg:py-16">
      <div className="max-w-9xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <AnimateIn>
          <div className="flex flex-col gap-3">
            <span className="bg-bg-basic-sky-contrast inline-flex w-fit items-center gap-2 rounded-full px-2 py-1.5 text-xs font-medium text-[#4e4e55]">
              <Sparkles
                size={12}
                className="size-5 rounded-full bg-[linear-gradient(to_right,#00EEFF_0%,#50BCFF_50%,#A9A5FF_100%)] p-1 text-black"
                fill="black"
              />
              Features
            </span>
            <h2 className="max-w-xl text-3xl leading-tight font-bold text-[#111115] sm:text-4xl">
              Everything you need to run your school, without the stress
            </h2>
          </div>
        </AnimateIn>

        {/* Feature 1: CBT Exams — full width */}
        <AnimateIn delay={50}>
          <div className="flex flex-col gap-8 rounded-2xl border border-zinc-200/70 bg-zinc-50 p-8 lg:flex-row lg:items-stretch">
            <div className="flex flex-1 flex-col gap-6 lg:justify-between">
              <div className="flex flex-col gap-4">
                <h3 className="text-xl leading-snug font-bold text-[#111115] sm:text-2xl">Run exams smoothly and get results faster</h3>
                <p className="text-sm leading-relaxed text-[#4e4e55]">
                  Create and manage computer-based tests without the usual stress of manual setup, marking, or delays. Axis supports multiple question
                  types and helps you deliver exams with more speed, accuracy, and confidence.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {["Auto-grade questions", "Set up tests in minutes", "Publish results faster", "Question Bank"].map(item => (
                  <CheckDot key={item} label={item} />
                ))}
              </div>
              <span className="bg-bg-badge-fuchsia inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-fuchsia-600">
                <span className="bg-bg-basic-fuchsia-strong h-1.5 w-1.5 rounded-full" />
                CBT Exams
              </span>
            </div>
            <div className="flex-1 lg:min-h-75">
              <CBTPreview />
            </div>
          </div>
        </AnimateIn>

        {/* Feature 2 & 3: Two column */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Parent Portal */}
          <AnimateIn delay={50}>
            <div className="flex h-full flex-col gap-5 rounded-2xl border border-zinc-200/70 bg-zinc-50 p-8">
              <div className="flex flex-col gap-4">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  Parent Portal
                </span>
                <h3 className="text-xl leading-snug font-bold text-[#111115]">Give parents instant access to results, anytime</h3>
                <p className="text-sm leading-relaxed text-[#4e4e55]">
                  Parents can access results, track payments, and stay updated without constant follow-ups.
                </p>
              </div>
              <ParentPortalPreview />
            </div>
          </AnimateIn>

          {/* Parent & Student Record */}
          <AnimateIn delay={150}>
            <div className="flex h-full flex-col gap-5 rounded-2xl border border-zinc-200/70 bg-zinc-50 p-8">
              <div className="flex flex-col gap-4">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-medium text-purple-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  Parent &amp; Student Record
                </span>
                <h3 className="text-xl leading-snug font-bold text-[#111115]">Keep all student and parent records in one place</h3>
                <p className="text-sm leading-relaxed text-[#4e4e55]">
                  Stop searching through scattered records. Keep student and parent information in one place, where it&apos;s easy to access, update,
                  and manage.
                </p>
              </div>
              <StudentRecordPreview />
            </div>
          </AnimateIn>
        </div>

        {/* And more */}
        <AnimateIn delay={50}>
          <div className="flex flex-col gap-5">
            <p className="text-center text-base font-semibold text-[#111115]">And more...</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              {featureTiles.map((tile, i) => (
                <div
                  key={tile.label}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-zinc-200/70 bg-white p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tile.iconBg} transition-opacity duration-200`}>
                    <tile.icon size={18} className={tile.iconColor} strokeWidth={2} />
                  </div>
                  <span className="text-sm font-medium text-[#111115]">{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
