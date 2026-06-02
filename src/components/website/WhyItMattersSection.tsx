import { DollarSignIcon, Target, Database, CircleAlert, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AnimateIn from "./AnimateIn";

const painPoints: { icon: LucideIcon; iconColor: string; iconBg: string; title: string; desc: string }[] = [
  {
    icon: CircleAlert,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    title: "Results are stressful and error-prone",
    desc: "Manual computation leads to mistakes and delays",
  },
  {
    icon: DollarSignIcon,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    title: "Fee tracking is manual and messy",
    desc: "Spreadsheets and paper records are hard to maintain",
  },
  {
    icon: Target,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-50",
    title: "Parents lack visibility",
    desc: "Constant calls and visits for basic information",
  },
  {
    icon: Database,
    iconColor: "text-rose-500",
    iconBg: "bg-rose-50",
    title: "Student data is scattered",
    desc: "Information spread across multiple systems and files",
  },
];

export default function WhyItMattersSection() {
  return (
    <section id="why-it-matters" className="border border-zinc-200/60 px-4 py-12 shadow-sm lg:py-16">
      <div className="max-w-9xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <AnimateIn>
          <div className="flex flex-col gap-3">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#E0F2FE] px-2 py-1.5 text-xs font-medium text-[#4e4e55]">
              <Sparkles
                size={12}
                className="size-5 rounded-full bg-[linear-gradient(to_right,#00EEFF_0%,#50BCFF_50%,#A9A5FF_100%)] p-1 text-black"
                fill="black"
              />
              Why It Matters
            </span>
            <h2 className="max-w-lg text-3xl leading-tight font-bold text-[#111115] sm:text-4xl">Running a school should not feel hard</h2>
          </div>
        </AnimateIn>

        {/* Pain point cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {painPoints.map((point, i) => (
            <AnimateIn key={point.title} delay={i * 100}>
              <div className="group flex h-full flex-col gap-4 rounded-2xl border border-zinc-200/70 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${point.iconBg}`}>
                  <point.icon size={18} className={point.iconColor} strokeWidth={2} />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-base leading-snug font-semibold text-[#111115]">{point.title}</p>
                  <p className="text-sm leading-relaxed text-[#4e4e55]">{point.desc}</p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* CTA strip */}
        <AnimateIn delay={100}>
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-[linear-gradient(to_right,#4E36FE,#8064FD,#9D68FF,#9E4EE7,#9810FA,#6845BA,#28219F)] px-8 py-12 text-center">
            <p className="max-w-2xl text-xl leading-snug font-bold text-white sm:text-2xl">
              Axis brings everything into one place so you can run your school with clarity and confidence.
            </p>
            <p className="text-sm text-[#FFFFFF]">One system. Complete visibility. Peace of mind.</p>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
