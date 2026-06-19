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

export type LandingView =
  | "home"
  | "services"
  | "search-results"
  | "vehicle-detail";

export interface SearchParams {
  from?: string;
  to?: string;
  date?: string;
  time?: string;
  durationHours?: number;
  bookingTab?: BookingTab;
  flightNumber?: string;
  passengers?: number;
}

interface ViewState {
  view: AppView;
  adminSection: AdminSection;
  /** Which landing view to render */
  landingView: LandingView;
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
  /** Search params from the booking widget (used by search results page) */
  searchParams: SearchParams | null;
  /** Selected vehicle slug (used by vehicle detail page) */
  selectedVehicleSlug: string | null;

  setView: (v: AppView) => void;
  setAdminSection: (s: AdminSection) => void;
  openAdmin: () => void;
  openLanding: () => void;
  setActiveService: (slug: ServiceSlug | null) => void;
  setBookingTab: (tab: BookingTab) => void;
  setBookingWidgetPrefill: (prefill: ViewState["bookingWidgetPrefill"]) => void;
  clearBookingWidgetPrefill: () => void;
  setLandingView: (v: LandingView) => void;
  setSearchParams: (p: SearchParams | null) => void;
  setSelectedVehicleSlug: (slug: string | null) => void;
  goToSearchResults: (params: SearchParams) => void;
  goToVehicleDetail: (slug: string) => void;
  goHome: () => void;
  goServices: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  view: "landing",
  adminSection: "dashboard",
  landingView: "home",
  activeService: null,
  bookingTab: "one-way",
  bookingWidgetPrefill: null,
  searchParams: null,
  selectedVehicleSlug: null,

  setView: (v) => set({ view: v }),
  setAdminSection: (s) => set({ adminSection: s }),
  openAdmin: () => set({ view: "admin", adminSection: "dashboard" }),
  openLanding: () =>
    set({
      view: "landing",
      landingView: "home",
      activeService: null,
      bookingWidgetPrefill: null,
      searchParams: null,
      selectedVehicleSlug: null,
    }),
  setActiveService: (slug) =>
    set({ view: "landing", activeService: slug, landingView: slug ? "home" : "home" }),
  setBookingTab: (tab) => set({ bookingTab: tab }),
  setBookingWidgetPrefill: (prefill) => set({ bookingWidgetPrefill: prefill }),
  clearBookingWidgetPrefill: () => set({ bookingWidgetPrefill: null }),
  setLandingView: (v) => set({ landingView: v }),
  setSearchParams: (p) => set({ searchParams: p }),
  setSelectedVehicleSlug: (slug) => set({ selectedVehicleSlug: slug }),
  goToSearchResults: (params) =>
    set({
      view: "landing",
      landingView: "search-results",
      searchParams: params,
      activeService: null,
      selectedVehicleSlug: null,
    }),
  goToVehicleDetail: (slug) =>
    set({
      view: "landing",
      landingView: "vehicle-detail",
      selectedVehicleSlug: slug,
    }),
  goHome: () =>
    set({
      view: "landing",
      landingView: "home",
      activeService: null,
      searchParams: null,
      selectedVehicleSlug: null,
    }),
  goServices: () =>
    set({
      view: "landing",
      landingView: "services",
      activeService: null,
      searchParams: null,
      selectedVehicleSlug: null,
    }),
}));
