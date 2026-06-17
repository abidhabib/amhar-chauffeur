"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.12,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function LandingHero() {
  const openBooking = useBookingStore((s) => s.openModal);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100svh] bg-cinematic texture-noise overflow-hidden"
    >
      {/* Background image — luxury car, warm-toned, with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY, scale: bgScale }}
      >
        <img
          src="https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=2400&q=80"
          alt=""
          className="w-full h-[115%] object-cover"
          aria-hidden
        />
        {/* Layered overlays for premium warmth + readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f6f1e9]/60 via-[#f6f1e9]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f6f1e9] via-[#f6f1e9]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f6f1e9]/70 via-transparent to-transparent" />
        {/* Gold tint accent */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 70% 30%, rgba(212, 184, 118, 0.20) 0%, transparent 60%)",
          }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10 pt-40 pb-32 min-h-[100svh] flex flex-col justify-center"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="max-w-3xl">
          <motion.p
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-eyebrow mb-8 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-[#b08842]" />
            Riyadh · Saudi Arabia · Middle East
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-display text-foreground mb-8"
          >
            The journey,
            <br />
            <span className="text-gold-gradient font-normal italic">elevated.</span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-body-lg max-w-xl mb-12"
          >
            A private chauffeur service for those who travel with intention.
            Discreet, punctual, and uncompromising — for airports, boardrooms,
            and the moments in between.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4"
          >
            <LuxuryButton
              size="lg"
              variant="solid-gold"
              magnetic
              onClick={() => openBooking()}
            >
              Request a Quote
              <ArrowRight size={15} strokeWidth={2} />
            </LuxuryButton>
            <LuxuryButton
              size="lg"
              variant="outline"
              magnetic
              onClick={() => {
                document
                  .getElementById("fleet")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              View the Fleet
            </LuxuryButton>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            custom={4}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="mt-20 pt-8 border-t border-foreground/[0.12] grid grid-cols-3 gap-6 max-w-xl"
          >
            {[
              { value: "24/7", label: "Concierge" },
              { value: "30+", label: "Luxury Vehicles" },
              { value: "100%", label: "Verified Drivers" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[34px] font-light text-foreground mb-1.5 tabular-nums">
                  {s.value}
                </div>
                <div className="text-[11px] tracking-[0.22em] uppercase text-foreground/65 font-semibold">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-foreground/60"
      >
        <span className="text-[11px] tracking-[0.26em] uppercase font-semibold">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-foreground/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
