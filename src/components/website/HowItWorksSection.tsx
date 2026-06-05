"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ChevronDown, Settings2, Sparkles } from "lucide-react";
import AnimateIn from "./AnimateIn";

const items = [
  {
    title: "Save hours on administrative work",
    desc: "Automate exams, results, and records so your staff spends less time on manual tasks.",
  },
  {
    title: "Reduce errors and improve accuracy",
    desc: "System-generated results and auto-calculations eliminate the human errors that come with manual processing.",
  },
  {
    title: "Keep parents informed and satisfied",
    desc: "Send automated notifications and give parents a portal to track results, fees, and attendance at any time.",
  },
  {
    title: "Stay organized and in control",
    desc: "All your school data — students, staff, finances, and results — is organised and accessible in one place.",
  },
  {
    title: "Access everything from anywhere",
    desc: "Axis is cloud-based. Your admin team, teachers, and parents can log in from any device, anytime.",
  },
];

export default function HowItWorksSection() {
  const [open, setOpen] = useState<number>(-1);

  return (
    <section className="px-4 py-12 lg:py-16">
      <div className="max-w-9xl mx-auto">
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-2 lg:gap-16">
          {/* Left: accordion */}
          <AnimateIn from="left" className="flex flex-1 flex-col gap-6">
            <div className="flex flex-col gap-3">
              <span className="bg-bg-basic-sky-contrast inline-flex w-fit items-center gap-2 rounded-full px-2 py-1.5 text-xs font-medium text-[#4e4e55]">
                <Sparkles
                  size={12}
                  className="size-5 rounded-full bg-[linear-gradient(to_right,#00EEFF_0%,#50BCFF_50%,#A9A5FF_100%)] p-1 text-black"
                  fill="black"
                />{" "}
                Why Choose Us
              </span>
              <h2 className="max-w-lg text-3xl leading-tight font-bold text-[#111115] sm:text-4xl">Transform How Your School Works</h2>
            </div>

            <div className="divide-y divide-zinc-200">
              {items.map((item, i) => (
                <div key={item.title}>
                  <button onClick={() => setOpen(open === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 py-4 text-left">
                    <span className={`text-sm sm:text-base ${open === i ? "font-semibold text-[#437dfc]" : "font-normal text-[#111115]"}`}>
                      {i + 1}. {item.title}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-[#6f6f77] transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open === i && <p className="pb-4 text-sm leading-relaxed text-[#4e4e55]">{item.desc}</p>}
                </div>
              ))}
            </div>

            <Link
              href="/auth/staff?step=signup"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-[#437dfc] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-600 hover:shadow-md active:scale-[0.98]"
            >
              Transform Your School Now
            </Link>
          </AnimateIn>

          {/* Right: 3D growth chart image */}
          <AnimateIn from="right" delay={150} className="w-full overflow-hidden rounded-2xl lg:h-120 lg:shrink-0">
            <Image
              src="/website/how-it-works.png"
              alt="School growth analytics illustration"
              width={480}
              height={420}
              className="h-full w-full object-cover"
            />
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
