"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone, MessageCircle } from "lucide-react";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { useBookingStore } from "@/stores/booking-store";
import { useViewStore } from "@/stores/view-store";

export function LandingFooter() {
  const openBooking = useBookingStore((s) => s.openModal);
  const openAdmin = useViewStore((s) => s.openAdmin);

  return (
    <footer className="border-t border-foreground/[0.06] bg-ink">
      {/* Final CTA */}
      <section className="border-b border-foreground/[0.06] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-eyebrow mb-8">Begin your journey</p>
            <h2 className="text-display text-foreground mb-8 max-w-3xl mx-auto">
              The next journey
              <br />
              <span className="text-gold-gradient italic font-normal">deserves more.</span>
            </h2>
            <p className="text-body-lg max-w-xl mx-auto mb-12">
              Submit a request today. Our concierge team will respond within
              minutes — tailored to your schedule, your destination, and your
              standard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LuxuryButton
                size="lg"
                variant="solid-gold"
                onClick={() => openBooking()}
              >
                Request a Quote
                <ArrowRight size={14} strokeWidth={2} />
              </LuxuryButton>
              <a href="https://wa.me/966503152119" target="_blank" rel="noreferrer">
                <LuxuryButton size="lg" variant="outline">
                  <MessageCircle size={14} strokeWidth={2} />
                  WhatsApp Concierge
                </LuxuryButton>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer body */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="text-[15px] font-medium tracking-[0.32em] text-foreground">
                AMHAR
              </span>
              <span className="text-[10px] tracking-[0.24em] uppercase text-foreground/40">
                Chauffeur
              </span>
            </div>
            <p className="text-[13px] text-foreground/50 font-light max-w-md leading-relaxed mb-6">
              A private chauffeur service based in Riyadh, Saudi Arabia.
              Premium limousine and chauffeur-driven transportation for airport
              transfers, corporate travel, VIPs, and bespoke journeys across
              the Kingdom and the wider Middle East.
            </p>
            <div className="flex items-center gap-5 text-[12px] text-foreground/45">
              <a
                href="https://www.facebook.com/profile.php?id=61579634004083"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors duration-200 tracking-[0.14em] uppercase"
              >
                Facebook
              </a>
              <a
                href="https://www.instagram.com/amharchaufferservice/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors duration-200 tracking-[0.14em] uppercase"
              >
                Instagram
              </a>
              <a
                href="https://www.youtube.com/@AmharLimousine"
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground transition-colors duration-200 tracking-[0.14em] uppercase"
              >
                YouTube
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-eyebrow-muted mb-5">Contact</p>
            <ul className="space-y-3 text-[13px]">
              <li>
                <a
                  href="tel:+966503152119"
                  className="flex items-center gap-2 text-foreground/65 hover:text-foreground transition-colors duration-200"
                >
                  <Phone size={12} strokeWidth={1.5} />
                  +966 50 315 2119
                </a>
              </li>
              <li>
                <a
                  href="mailto:booking@amharksa.com"
                  className="flex items-center gap-2 text-foreground/65 hover:text-foreground transition-colors duration-200"
                >
                  <Mail size={12} strokeWidth={1.5} />
                  booking@amharksa.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/966503152119"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-foreground/65 hover:text-foreground transition-colors duration-200"
                >
                  <MessageCircle size={12} strokeWidth={1.5} />
                  WhatsApp Concierge
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-eyebrow-muted mb-5">Navigate</p>
            <ul className="space-y-3 text-[13px]">
              <li>
                <a href="#services" className="text-foreground/65 hover:text-foreground transition-colors duration-200">
                  Services
                </a>
              </li>
              <li>
                <a href="#fleet" className="text-foreground/65 hover:text-foreground transition-colors duration-200">
                  Fleet
                </a>
              </li>
              <li>
                <a href="#how" className="text-foreground/65 hover:text-foreground transition-colors duration-200">
                  How it works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-foreground/65 hover:text-foreground transition-colors duration-200">
                  Clients
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-foreground/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] tracking-[0.14em] uppercase text-foreground/35">
            © {new Date().getFullYear()} AMHAR Premier Chauffeur Service
          </p>
          <div className="flex items-center gap-6 text-[11px] tracking-[0.14em] uppercase text-foreground/35">
            <a href="#" className="hover:text-foreground/60 transition-colors">
              Privacy
            </a>
            {/* Subtle operator portal link — accessed via tiny text link */}
            <button
              onClick={openAdmin}
              className="hover:text-foreground/60 transition-colors"
              title="Operator portal"
            >
              Operator Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
