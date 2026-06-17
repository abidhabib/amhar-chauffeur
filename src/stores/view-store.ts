/**
 * View store — toggles between public landing and admin operator portal
 * on the single sandbox-visible "/" route.
 */
import { create } from "zustand";

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
  setView: (v: AppView) => void;
  setAdminSection: (s: AdminSection) => void;
  openAdmin: () => void;
  openLanding: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
  view: "landing",
  adminSection: "dashboard",
  setView: (v) => set({ view: v }),
  setAdminSection: (s) => set({ adminSection: s }),
  openAdmin: () => set({ view: "admin", adminSection: "dashboard" }),
  openLanding: () => set({ view: "landing" }),
}));
