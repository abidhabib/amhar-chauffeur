"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ArrowRight } from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#fleet", label: "Fleet" },
  { href: "#how", label: "How it works" },
  { href: "#testimonials", label: "Clients" },
];

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const openBooking = useBookingStore((s) => s.openModal);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(
      Boolean,
    ) as Element[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // When not scrolled AND mobile menu closed, nav sits over the dark hero — use ivory text
  // When scrolled OR mobile menu open, use espresso text (over ivory backdrop)
  const onDark = !scrolled && !mobileOpen;

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    // Wait for drawer to close before scrolling
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 350);
  };

  const handleBookingClick = () => {
    setMobileOpen(false);
    setTimeout(() => openBooking(), 350);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-400",
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-foreground/[0.10]"
            : "bg-transparent border-b border-transparent",
        )}
        style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Wordmark */}
            <a
              href="#top"
              className="flex items-center gap-3 group"
              aria-label="AMHAR home"
            >
              <span
                className={cn(
                  "text-[17px] font-semibold tracking-[0.34em] transition-colors duration-400",
                  onDark ? "text-[#f6f1e9]" : "text-foreground",
                )}
              >
                AMHAR
              </span>
              <span
                className={cn(
                  "hidden sm:inline text-[10px] tracking-[0.26em] uppercase transition-colors duration-400 font-semibold",
                  onDark
                    ? "text-[#f6f1e9]/55 group-hover:text-[#d4b876]"
                    : "text-foreground/50 group-hover:text-[#b08842]",
                )}
              >
                Chauffeur
              </span>
            </a>

            {/* Desktop nav with scroll-spy */}
            <nav className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) => {
                const active = activeSection === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "relative text-[13px] tracking-[0.14em] uppercase transition-colors duration-200 font-medium",
                      onDark
                        ? (active ? "text-[#f6f1e9]" : "text-[#f6f1e9]/65 hover:text-[#f6f1e9]")
                        : (active ? "text-foreground" : "text-foreground/60 hover:text-foreground"),
                    )}
                  >
                    {link.label}
                    <span
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-px transition-all duration-400",
                        onDark ? "bg-[#d4b876]" : "bg-[#b08842]",
                        active ? "w-full" : "w-0",
                      )}
                      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
                    />
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-3">
              <a
                href="tel:+966503152119"
                className={cn(
                  "hidden lg:inline text-[13px] tracking-[0.14em] uppercase transition-colors duration-200 font-medium",
                  onDark
                    ? "text-[#f6f1e9]/65 hover:text-[#f6f1e9]"
                    : "text-foreground/65 hover:text-foreground",
                )}
              >
                +966 50 315 2119
              </a>
              <LuxuryButton
                size="sm"
                variant="solid-gold"
                onClick={() => openBooking()}
                className="hidden sm:inline-flex"
              >
                Request a Quote
              </LuxuryButton>

              {/* Mobile menu trigger */}
              <button
                className={cn(
                  "md:hidden p-2 -mr-2 transition-colors duration-200",
                  onDark ? "text-[#f6f1e9]" : "text-foreground",
                )}
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={24} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen drawer — slides in from left */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 z-[60] bg-[#0f0c08]/60 backdrop-blur-sm"
            />

            {/* Fullscreen panel — slides from left to right */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed inset-0 z-[70] bg-gradient-to-br from-[#1f1a14] via-[#1a1612] to-[#0f0c08] flex flex-col"
            >
              {/* Top bar with wordmark + close icon */}
              <div className="flex items-center justify-between px-7 h-20 border-b border-[#f6f1e9]/10">
                <div className="flex items-center gap-3">
                  <span className="text-[17px] font-semibold tracking-[0.34em] text-[#f6f1e9]">
                    AMHAR
                  </span>
                  <span className="text-[10px] tracking-[0.26em] uppercase text-[#f6f1e9]/50 font-semibold">
                    Chauffeur
                  </span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-11 h-11 flex items-center justify-center text-[#f6f1e9]/75 hover:text-[#f6f1e9] hover:bg-[#f6f1e9]/8 rounded-sm transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* Body — nav links with stagger animation */}
              <div className="flex-1 flex flex-col justify-center px-7">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-eyebrow mb-8 flex items-center gap-3"
                >
                  <span className="w-7 h-px bg-[#d4b876]" />
                  Navigate
                </motion.p>

                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link, i) => {
                    const active = activeSection === link.href;
                    return (
                      <motion.button
                        key={link.href}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.18 + i * 0.07,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        onClick={() => handleNavClick(link.href)}
                        className={cn(
                          "group flex items-center justify-between py-5 border-b border-[#f6f1e9]/8 transition-colors duration-200",
                          active ? "text-[#d4b876]" : "text-[#f6f1e9]/85 hover:text-[#f6f1e9]",
                        )}
                      >
                        <span className="text-[24px] font-light tracking-tight">
                          {link.label}
                        </span>
                        <span className="flex items-center gap-3">
                          <span className="text-[11px] tracking-[0.22em] uppercase text-[#f6f1e9]/35 font-semibold">
                            0{i + 1}
                          </span>
                          <ArrowRight
                            size={16}
                            strokeWidth={1.5}
                            className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#d4b876]"
                          />
                        </span>
                      </motion.button>
                    );
                  })}
                </nav>
              </div>

              {/* Footer — contact + CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="px-7 py-9 border-t border-[#f6f1e9]/10 space-y-5"
              >
                <a
                  href="tel:+966503152119"
                  className="flex items-center gap-3 text-[#f6f1e9]/75 hover:text-[#d4b876] transition-colors duration-200"
                >
                  <Phone size={15} strokeWidth={1.5} className="text-[#d4b876]" />
                  <span className="text-[15px] font-medium tracking-wide">+966 50 315 2119</span>
                </a>
                <LuxuryButton
                  size="lg"
                  variant="solid-gold"
                  onClick={handleBookingClick}
                  className="w-full"
                >
                  Request a Quote
                  <ArrowRight size={15} strokeWidth={2} />
                </LuxuryButton>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
