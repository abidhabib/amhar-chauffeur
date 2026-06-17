"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { useRef } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.12,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function LandingHero() {
  const openBooking = useBookingStore((s) => s.openModal);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax: background image drifts slower than foreground as user scrolls
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [0.35, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100svh] bg-cinematic texture-noise overflow-hidden"
    >
      {/* Background image — luxury car silhouette, dark, with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: bgY, opacity: bgOpacity }}
      >
        <img
          src="https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=2400&q=80"
          alt=""
          className="w-full h-[120%] object-cover"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/65 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
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
            className="text-eyebrow mb-8"
          >
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
              <ArrowRight size={14} strokeWidth={2} />
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
            className="mt-20 pt-8 border-t border-foreground/[0.10] grid grid-cols-3 gap-6 max-w-xl"
          >
            {[
              { value: "24/7", label: "Concierge" },
              { value: "30+", label: "Luxury Vehicles" },
              { value: "100%", label: "Verified Drivers" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-[32px] font-light text-foreground mb-1.5 tabular-nums">
                  {s.value}
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-foreground/60 font-medium">
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-foreground/55"
      >
        <span className="text-[10px] tracking-[0.24em] uppercase font-medium">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={12} />
        </motion.div>
      </motion.div>
    </section>
  );
}
