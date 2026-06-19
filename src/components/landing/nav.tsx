"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, ArrowRight, ChevronDown } from "lucide-react";
import {
  Plane, MapPin, Car, Clock, Sparkles,
} from "lucide-react";
import { useBookingStore } from "@/stores/booking-store";
import { useViewStore } from "@/stores/view-store";
import { LuxuryButton } from "@/components/shared/luxury-button";
import { SERVICES_CATALOG, type ServiceSlug } from "@/lib/services-catalog";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "services", label: "Services", isPage: true },
  { href: "#how", label: "How it works" },
  { href: "#testimonials", label: "Clients" },
] as const;

const SERVICE_ICONS: Record<ServiceSlug, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  "city-to-city": MapPin,
  "chauffeur-hailing": Car,
  "airport-transfer": Plane,
  "hourly-car-service": Clock,
  "chauffeur-service": Car,
  "limousine-service": Sparkles,
};

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const openBooking = useBookingStore((s) => s.openModal);
  const setActiveService = useViewStore((s) => s.setActiveService);
  const setBookingTab = useViewStore((s) => s.setBookingTab);
  const goServices = useViewStore((s) => s.goServices);
  const goHome = useViewStore((s) => s.goHome);

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

  const onDark = !scrolled && !mobileOpen;

  const handleServiceSelect = (slug: ServiceSlug) => {
    const service = SERVICES_CATALOG.find((s) => s.slug === slug);
    if (!service) return;
    setServicesOpen(false);
    setBookingTab(service.bookingTab);
    setActiveService(slug);
    // Scroll to top of page (where service detail renders)
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    // Clear active service so the section anchor is visible
    setActiveService(null);
    setTimeout(() => {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
              onClick={(e) => {
                e.preventDefault();
                goHome();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-10">
              {/* Our Services dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setServicesOpen((v) => !v)}
                  className={cn(
                    "flex items-center gap-1.5 text-[13px] tracking-[0.14em] uppercase font-medium transition-colors duration-200",
                    onDark
                      ? (servicesOpen ? "text-[#f6f1e9]" : "text-[#f6f1e9]/65 hover:text-[#f6f1e9]")
                      : (servicesOpen ? "text-foreground" : "text-foreground/60 hover:text-foreground"),
                  )}
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                >
                  Our Services
                  <ChevronDown
                    size={13}
                    strokeWidth={2}
                    className={cn(
                      "transition-transform duration-300",
                      servicesOpen && "rotate-180",
                    )}
                  />
                </button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[540px] bg-card border border-foreground/[0.12] rounded-md shadow-[0_30px_70px_-25px_rgba(26,22,18,0.35)] overflow-hidden"
                    >
                      {/* Dropdown header */}
                      <div className="px-6 pt-5 pb-3 border-b border-foreground/[0.06] bg-gradient-to-br from-card to-[#b08842]/[0.04]">
                        <p className="text-[10px] tracking-[0.26em] uppercase text-[#b08842] font-semibold flex items-center gap-2">
                          <span className="w-6 h-px bg-[#b08842]" />
                          Our Services
                        </p>
                        <p className="text-[13px] text-foreground/65 mt-1.5 font-normal">
                          Six considered transportation services across Saudi Arabia
                        </p>
                      </div>

                      {/* Service items grid */}
                      <div className="grid grid-cols-2 gap-px bg-foreground/[0.06]">
                        {SERVICES_CATALOG.map((s) => {
                          const Icon = SERVICE_ICONS[s.slug];
                          return (
                            <button
                              key={s.slug}
                              type="button"
                              onClick={() => handleServiceSelect(s.slug)}
                              className="group bg-card hover:bg-foreground/[0.02] p-4 text-left transition-colors duration-200 flex items-start gap-3"
                            >
                              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-sm border border-foreground/12 text-foreground/70 group-hover:border-[#b08842]/50 group-hover:text-[#b08842] group-hover:bg-[#b08842]/[0.06] transition-all duration-300">
                                <Icon size={15} strokeWidth={1.5} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-[12.5px] font-semibold text-foreground tracking-tight">
                                  {s.label}
                                </div>
                                <div className="text-[10.5px] text-foreground/55 mt-0.5 leading-snug">
                                  {s.tagline}
                                </div>
                              </div>
                              <ArrowRight
                                size={11}
                                strokeWidth={2}
                                className="flex-shrink-0 text-foreground/30 group-hover:text-[#b08842] group-hover:translate-x-0.5 transition-all duration-300 mt-1"
                              />
                            </button>
                          );
                        })}
                      </div>

                      {/* Dropdown footer */}
                      <div className="px-6 py-3 bg-foreground/[0.02] border-t border-foreground/[0.06] flex items-center justify-between">
                        <p className="text-[10px] tracking-[0.18em] uppercase text-foreground/50 font-semibold">
                          🇸🇦 Saudi Arabia only
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setServicesOpen(false);
                            openBooking();
                          }}
                          className="text-[11px] tracking-[0.18em] uppercase text-[#b08842] hover:text-[#8a6d3b] font-semibold transition-colors"
                        >
                          Request a Quote →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Plain nav links */}
              {NAV_LINKS.map((link) => {
                const active = activeSection === link.href;
                const isPageLink = "isPage" in link && link.isPage;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      if (isPageLink) {
                        // Navigate to the services page
                        goServices();
                      } else {
                        handleNavClick(link.href);
                      }
                    }}
                    className={cn(
                      "relative text-[13px] tracking-[0.14em] uppercase transition-colors duration-200 font-medium cursor-pointer",
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

      {/* Mobile fullscreen drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 z-[60] bg-[#0f0c08]/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden fixed inset-0 z-[70] bg-gradient-to-br from-[#1f1a14] via-[#1a1612] to-[#0f0c08] flex flex-col"
            >
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

              <div className="flex-1 flex flex-col justify-center px-7 overflow-y-auto">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="text-eyebrow mb-5 flex items-center gap-3"
                >
                  <span className="w-7 h-px bg-[#d4b876]" />
                  Our Services
                </motion.p>

                <div className="flex flex-col gap-0 mb-7">
                  {SERVICES_CATALOG.map((s, i) => {
                    const Icon = SERVICE_ICONS[s.slug];
                    return (
                      <motion.button
                        key={s.slug}
                        initial={{ opacity: 0, x: -24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.18 + i * 0.05,
                          duration: 0.4,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                        onClick={() => {
                          setMobileOpen(false);
                          setTimeout(() => handleServiceSelect(s.slug), 100);
                        }}
                        className="group flex items-center gap-4 py-4 border-b border-[#f6f1e9]/8 text-left"
                      >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-sm border border-[#d4b876]/30 text-[#d4b876] bg-[#d4b876]/[0.06]">
                          <Icon size={15} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[15px] font-medium text-[#f6f1e9] tracking-tight">
                            {s.label}
                          </div>
                          <div className="text-[10.5px] text-[#f6f1e9]/45 mt-0.5">
                            {s.tagline}
                          </div>
                        </div>
                        <ArrowRight
                          size={14}
                          strokeWidth={1.5}
                          className="text-[#d4b876]/40 group-hover:text-[#d4b876] group-hover:translate-x-1 transition-all duration-300"
                        />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Plain nav links at bottom */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="grid grid-cols-2 gap-3 pt-5 border-t border-[#f6f1e9]/10"
                >
                  {NAV_LINKS.map((link) => {
                    const isPageLink = "isPage" in link && link.isPage;
                    return (
                      <button
                        key={link.href}
                        onClick={() => {
                          setMobileOpen(false);
                          setTimeout(() => {
                            if (isPageLink) {
                              goServices();
                            } else {
                              handleNavClick(link.href);
                            }
                          }, 100);
                        }}
                        className="text-[12px] tracking-[0.16em] uppercase text-[#f6f1e9]/65 hover:text-[#d4b876] font-semibold transition-colors text-left py-2"
                      >
                        {link.label}
                      </button>
                    );
                  })}
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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
