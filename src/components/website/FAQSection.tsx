"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, Sparkles } from "lucide-react";
import AnimateIn from "./AnimateIn";

const faqs = [
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes. You can cancel your subscription at any time from your account settings. There are no cancellation fees and your data remains accessible until the end of your billing period.",
  },
  {
    question: "How does the student count pricing work?",
    answer:
      "Pricing is per student, per term (or per year if you choose annual billing). You select your student count tier at the start of each billing period. If your enrolment grows, you can upgrade your tier at any time.",
  },
  {
    question: "Is my school's data secure on Axis?",
    answer:
      "Absolutely. Axis uses industry-standard encryption for data at rest and in transit. Access is role-based, meaning staff only see what they need. We do not sell or share your school's data with third parties.",
  },
  {
    question: "Can I try Axis before subscribing?",
    answer:
      "Yes — we offer a free demo account that lets you explore the full platform with sample data. You can access it immediately, no credit card required.",
  },
  {
    question: "What modules are included in the Standard plan?",
    answer:
      "The Standard plan includes 16+ modules covering academics, fee management, attendance, parent portal, staff management, and more. You can view the full feature list on the pricing page.",
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 py-12 lg:py-16">
      <div className="mx-auto flex max-w-9xl flex-col gap-10">
        {/* Header */}
        <AnimateIn>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="bg-bg-basic-sky-contrast inline-flex w-fit items-center gap-2 rounded-full px-2 py-1.5 text-xs font-medium text-[#4e4e55]">
              <Sparkles
                size={12}
                className="size-5 rounded-full bg-[linear-gradient(to_right,#00EEFF_0%,#50BCFF_50%,#A9A5FF_100%)] p-1 text-black"
                fill="black"
              />{" "}
              FAQ
            </span>
            <h2 className="max-w-lg text-3xl leading-tight font-bold text-[#111115] sm:text-4xl">Have questions? We&apos;ve got answers</h2>
          </div>
        </AnimateIn>

        {/* Accordion */}
        <AnimateIn delay={100} className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <button
                key={faq.question}
                onClick={() => setOpen(open === i ? null : i)}
                className={`group w-full rounded-2xl border px-6 py-4 text-left transition-all duration-200 ${
                  open === i ? "border-zinc-200 bg-white shadow-sm" : "border-zinc-200/70 bg-zinc-50 hover:border-zinc-200 hover:bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#111115] sm:text-base">{faq.question}</p>
                    {open === i && <p className="mt-3 text-sm leading-relaxed text-[#4e4e55]">{faq.answer}</p>}
                  </div>
                  <ChevronDown
                    size={17}
                    className={`mt-0.5 shrink-0 text-[#6f6f77] transition-transform duration-200 ${open === i ? "rotate-180 text-[#437dfc]" : ""}`}
                  />
                </div>
              </button>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
