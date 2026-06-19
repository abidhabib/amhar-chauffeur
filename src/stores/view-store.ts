/**
 * View store — toggles between public landing and admin operator portal
 * on the single sandbox-visible "/" route.
 *
 * Also tracks:
 *  - activeService: when set, the landing page renders a service detail view
 *    (replacing the default landing content) for the selected service
 *  - bookingTab: which tab the booking widget should default to ("one-way" | "by-the-hour")
 */
import { create } from "zustand";
import type { ServiceSlug, BookingTab } from "@/lib/services-catalog";

export type AppView = "landing" | "admin";
export type AdminSection =
  | "dashboard"
  | "leads"
  | "fleet"
  | "reviews"
  | "users"
  | "audit";

interface ViewState {
  view: AppView;
  adminSection: AdminSection;
  /** When set, landing page shows this service detail instead of home */
  activeService: ServiceSlug | null;
  /** Default booking tab to open */
  bookingTab: BookingTab;
  /** Whether the booking modal was triggered from the widget */
  bookingWidgetPrefill: {
    from?: string;
    to?: string;
    date?: string;
    time?: string;
    durationHours?: number;
    service?: ServiceSlug;
  } | null;

  setView: (v: AppView) => void;
  setAdminSection: (s: AdminSection) => void;
  openAdmin: () => void;
  openLanding: () => void;
  setActiveService: (slug: ServiceSlug | null) => void;
  setBookingTab: (tab: BookingTab) => void;
  setBookingWidgetPrefill: (prefill: ViewState["bookingWidgetPrefill"]) => void;
  clearBookingWidgetPrefill: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  view: "landing",
  adminSection: "dashboard",
  activeService: null,
  bookingTab: "one-way",
  bookingWidgetPrefill: null,

  setView: (v) => set({ view: v }),
  setAdminSection: (s) => set({ adminSection: s }),
  openAdmin: () => set({ view: "admin", adminSection: "dashboard" }),
  openLanding: () =>
    set({ view: "landing", activeService: null, bookingWidgetPrefill: null }),
  setActiveService: (slug) =>
    set({ view: "landing", activeService: slug }),
  setBookingTab: (tab) => set({ bookingTab: tab }),
  setBookingWidgetPrefill: (prefill) => set({ bookingWidgetPrefill: prefill }),
  clearBookingWidgetPrefill: () => set({ bookingWidgetPrefill: null }),
}));
