"use client";

import { Reveal } from "@/components/shared/reveal";

const STEPS = [
  {
    number: "01",
    title: "Submit your request",
    description:
      "Open the request form and share your journey details — pickup, destination, vehicle preference, passengers, and contact. No payment required.",
  },
  {
    number: "02",
    title: "Receive a tailored quote",
    description:
      "Within minutes, our concierge team reviews your request and responds via WhatsApp or email with a tailored quotation and the chauffeur's contact details.",
  },
  {
    number: "03",
    title: "Travel, undistracted",
    description:
      "On the day of your journey, your chauffeur arrives early — uniformed, briefed, and discreet. You travel. We handle every detail in between.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="py-32 lg:py-40 border-t border-foreground/[0.08] bg-foreground/[0.02]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl mb-20">
          <p className="text-eyebrow mb-6">How it works</p>
          <h2 className="text-headline text-foreground mb-6">
            Three steps.
            <br />
            <span className="text-foreground/45">No friction.</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.number}
              delay={i * 140}
              className="relative group"
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[42%] right-[-20%] h-px bg-gradient-to-r from-[#c9a961]/30 via-foreground/10 to-transparent" />
              )}

              <div className="text-[52px] font-light text-[#c9a961] mb-8 leading-none tabular-nums transition-transform duration-500 group-hover:scale-105 origin-left">
                {s.number}
              </div>
              <h3 className="text-[21px] font-medium text-foreground mb-4 tracking-tight">
                {s.title}
              </h3>
              <p className="text-[14.5px] leading-relaxed text-foreground/70 font-normal">
                {s.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
