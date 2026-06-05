import { UserCircle } from "lucide-react";
import AnimateIn from "./AnimateIn";

const testimonials = [
  {
    quote:
      "Result processing that used to take 3 days now takes 4 hours. And we're confident there are no errors. Axis has transformed our operations completely.",
    name: "Mrs Jumoke Ali",
    role: "Principal, Amoke Oge",
    initials: "JA",
    cardBg: "bg-green-50",
    avatarBg: "bg-green-500",
  },
  {
    quote:
      "Our parents used to call us every week asking for results and fee balances. Now they check it themselves. Axis saved us hours of phone calls every term.",
    name: "Mr Chukwuemeka Obi",
    role: "Director, Sunlight Academy",
    initials: "CO",
    cardBg: "bg-purple-50",
    avatarBg: "bg-purple-500",
  },
  {
    quote:
      "Switching from spreadsheets to Axis was the best decision we made. Our staff is less stressed, our records are cleaner, and our parents are happier.",
    name: "Mrs Adeyemi Fatima",
    role: "Head Teacher, Bright Stars School",
    initials: "AF",
    cardBg: "bg-amber-50",
    avatarBg: "bg-amber-500",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="px-4 py-12 lg:py-16">
      <div className="mx-auto flex max-w-9xl flex-col gap-10">
        {/* Header */}
        <AnimateIn>
          <div className="flex flex-col gap-3">
            <span className="bg-bg-basic-sky-contrast inline-flex w-fit items-center gap-2 rounded-full px-2 py-1.5 text-xs font-medium text-[#4e4e55]">
              <UserCircle
                size={12}
                className="size-5 rounded-full bg-[linear-gradient(to_right,#00EEFF_0%,#50BCFF_50%,#A9A5FF_100%)] p-1 text-black"
                // fill="black"
              />
              Testimonials
            </span>
            <h2 className="max-w-lg text-3xl leading-tight font-bold text-[#111115] sm:text-4xl">Real Stories From Real Schools Using Axis</h2>
          </div>
        </AnimateIn>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 120}>
              <div className={`flex h-full flex-col justify-between gap-6 rounded-2xl p-6 ${t.cardBg}`}>
                <p className="text-sm leading-relaxed text-[#111115]">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t.avatarBg}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111115]">{t.name}</p>
                    <p className="text-xs text-[#6f6f77]">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
