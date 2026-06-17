"use client";

import { motion } from "framer-motion";

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
      className="py-32 lg:py-40 border-t border-foreground/[0.06] bg-foreground/[0.015]"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-3xl mb-20">
          <p className="text-eyebrow mb-6">How it works</p>
          <h2 className="text-headline text-foreground mb-6">
            Three steps.
            <br />
            <span className="text-foreground/40">No friction.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-6 left-[40%] right-[-20%] h-px bg-gradient-to-r from-foreground/15 to-transparent" />
              )}

              <div className="text-[44px] font-light text-[#c9a961] mb-8 leading-none">
                {s.number}
              </div>
              <h3 className="text-[20px] font-medium text-foreground mb-4 tracking-tight">
                {s.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-foreground/55 font-light">
                {s.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
