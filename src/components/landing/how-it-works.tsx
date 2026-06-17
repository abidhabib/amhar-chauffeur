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
      className="py-32 lg:py-44 border-t border-foreground/[0.10] bg-charcoal texture-noise relative overflow-hidden"
    >
      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <Reveal className="max-w-3xl mb-20">
          <p className="text-eyebrow mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-[#d4b876]" />
            How it works
          </p>
          <h2 className="text-headline text-ivory mb-7">
            Three steps.
            <br />
            <span className="text-ivory/45">No friction.</span>
          </h2>
          <p className="text-body-lg max-w-xl text-ivory/70">
            A considered process — from request to arrival — designed to disappear
            into the background of your day. You ask. We handle. You travel.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {STEPS.map((s, i) => (
            <Reveal
              key={s.number}
              delay={i * 150}
              className="relative group"
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-9 left-[45%] right-[-20%] h-px bg-gradient-to-r from-[#d4b876]/40 via-[#d4b876]/15 to-transparent" />
              )}

              <div className="text-[64px] font-light text-[#d4b876] mb-9 leading-none tabular-nums transition-transform duration-500 group-hover:scale-110 origin-left">
                {s.number}
              </div>
              <h3 className="text-[24px] font-semibold text-ivory mb-5 tracking-tight">
                {s.title}
              </h3>
              <p className="text-[16px] leading-relaxed text-ivory/70 font-normal">
                {s.description}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
