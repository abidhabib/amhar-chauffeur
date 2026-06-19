/**
 * AMHAR Services Catalog
 * Maps each service to its booking behavior, fleet category, and metadata.
 */

import type { VehicleCategory } from "./dto/lead.dto";

export type ServiceSlug =
  | "city-to-city"
  | "chauffeur-hailing"
  | "airport-transfer"
  | "hourly-car-service"
  | "chauffeur-service"
  | "limousine-service";

export type BookingTab = "one-way" | "by-the-hour";

export interface ServiceCatalogEntry {
  slug: ServiceSlug;
  label: string;
  shortLabel: string;
  description: string;
  /** Which booking tab this service maps to */
  bookingTab: BookingTab;
  /** Default vehicle category for this service */
  defaultCategory: VehicleCategory;
  /** Icon name (from lucide-react) — kept as string for serialization */
  icon: "MapPin" | "Car" | "Plane" | "Clock" | "Hotel" | "Sparkles";
  /** Brief tagline shown in dropdown */
  tagline: string;
  /** Longer description shown on service detail page */
  longDescription: string;
  /** Common use cases */
  useCases: string[];
}

export const SERVICES_CATALOG: ServiceCatalogEntry[] = [
  {
    slug: "city-to-city",
    label: "City-to-City rides",
    shortLabel: "City-to-City",
    description: "The considered alternative to short-haul flights and rail.",
    bookingTab: "one-way",
    defaultCategory: "sedan",
    icon: "MapPin",
    tagline: "Travel between Saudi cities in total privacy",
    longDescription:
      "The considered alternative to short-haul flights and rail. Travel between cities in total privacy, with the rhythm of your schedule, not ours. Door-to-door service with a dedicated chauffeur, real-time flight tracking where applicable, and complimentary waiting time.",
    useCases: [
      "Riyadh ↔ Jeddah (cross-country business)",
      "Jeddah ↔ Makkah (Umrah pilgrimage)",
      "Madinah ↔ Yanbu (coastal transfer)",
      "Dammam ↔ Riyadh (Eastern Province commute)",
    ],
  },
  {
    slug: "chauffeur-hailing",
    label: "Chauffeur hailing",
    shortLabel: "Hailing",
    description: "On-demand luxury chauffeur, summoned to your location.",
    bookingTab: "by-the-hour",
    defaultCategory: "sedan",
    icon: "Car",
    tagline: "On-demand luxury, dispatched within minutes",
    longDescription:
      "On-demand luxury chauffeur, dispatched to your location within minutes. Pre-book or request as soon as you need a ride — our network of professional drivers covers all major KSA cities. Pay by the hour, with a 2-hour minimum.",
    useCases: [
      "Same-day requests in Riyadh, Jeddah, Madinah",
      "Multi-stop business meetings",
      "Discreet urban transfers",
      "Last-mile from airport or hotel",
    ],
  },
  {
    slug: "airport-transfer",
    label: "Airport transfers",
    shortLabel: "Airport",
    description: "Meet & greet at arrivals. Flight tracking included.",
    bookingTab: "one-way",
    defaultCategory: "sedan",
    icon: "Plane",
    tagline: "Stress-free airport pickups across all major KSA airports",
    longDescription:
      "Stress-free pickups and drop-offs at every major airport in Saudi Arabia. Real-time flight tracking, personalized Meet & Greet with your chauffeur holding a name sign at arrivals, 60 minutes of complimentary waiting time, and assistance with luggage. Servicing King Khalid (RUH), King Abdulaziz (JED), Prince Mohammad bin Abdulaziz (MED), King Fahd (DMM), and regional airports.",
    useCases: [
      "King Khalid International Airport (RUH) — Riyadh",
      "King Abdulaziz International Airport (JED) — Jeddah",
      "Prince Mohammad bin Abdulaziz Airport (MED) — Madinah",
      "King Fahd International Airport (DMM) — Dammam",
    ],
  },
  {
    slug: "hourly-car-service",
    label: "Hourly hire",
    shortLabel: "Hourly",
    description: "A dedicated chauffeur at your disposal, by the hour.",
    bookingTab: "by-the-hour",
    defaultCategory: "sedan",
    icon: "Clock",
    tagline: "Dedicated chauffeur, billed by the hour",
    longDescription:
      "Enjoy total freedom with a dedicated chauffeur at your disposal for hourly or full-day bookings, tailored to your schedule. Minimum 2 hours. Ideal for business meetings across multiple locations, full-day delegations, or events where you need a driver waiting on standby.",
    useCases: [
      "Multi-meeting business days",
      "Weddings & private events",
      "VIP delegations & protocol",
      "Shopping & city exploration days",
    ],
  },
  {
    slug: "chauffeur-service",
    label: "Chauffeur service",
    shortLabel: "Chauffeur",
    description: "Premium standalone chauffeur — by the hour or per trip.",
    bookingTab: "by-the-hour",
    defaultCategory: "sedan",
    icon: "Car",
    tagline: "A professional chauffeur, on your terms",
    longDescription:
      "Elevate your travel experience with our Premium Chauffeur Service, where luxury meets reliability. Available by the hour or per individual trip. All chauffeurs are background-checked, English & Arabic speaking, and trained in VIP protocol.",
    useCases: [
      "Executive transport for executives & dignitaries",
      "Multi-day corporate bookings",
      "Wedding & event chauffeur",
      "Personal driver for the day",
    ],
  },
  {
    slug: "limousine-service",
    label: "Limousine service",
    shortLabel: "Limousine",
    description: "The pinnacle of luxury — for events, weddings, and special occasions.",
    bookingTab: "by-the-hour",
    defaultCategory: "sedan",
    icon: "Sparkles",
    tagline: "For events, weddings, and milestones",
    longDescription:
      "Experience the pinnacle of luxury and sophistication with our premium limousine services. Whether you're heading to a special event, corporate meeting, or simply desire a stylish ride, our fleet of high-end vehicles ensures unmatched comfort and elegance. From Rolls Royce to Mercedes S-Class, BMW 7 Series to Range Rover — every vehicle is immaculate.",
    useCases: [
      "Weddings & marriage processions",
      "Red carpet & gala events",
      "VIP airport arrivals",
      "Anniversary & milestone celebrations",
    ],
  },
];

export const getServiceBySlug = (slug: ServiceSlug): ServiceCatalogEntry | undefined =>
  SERVICES_CATALOG.find((s) => s.slug === slug);

/** Popular KSA routes — shown on the booking page as "Available journeys" */
export interface PopularRoute {
  id: string;
  from: string;
  to: string;
  fromRegion: string;
  toRegion: string;
  /** Approx duration in hours */
  durationHours: number;
  /** Approx distance in km */
  distanceKm: number;
  /** Service slug this route maps to */
  service: ServiceSlug;
  /** Why this route is popular */
  note: string;
}

export const POPULAR_ROUTES: PopularRoute[] = [
  {
    id: "ruh-jed",
    from: "Riyadh",
    to: "Jeddah",
    fromRegion: "Riyadh",
    toRegion: "Makkah",
    durationHours: 10,
    distanceKm: 950,
    service: "city-to-city",
    note: "Most popular cross-country route",
  },
  {
    id: "ruh-jed-airport",
    from: "King Khalid Intl Airport (RUH)",
    to: "Riyadh city",
    fromRegion: "Riyadh Airport",
    toRegion: "Riyadh",
    durationHours: 0.6,
    distanceKm: 35,
    service: "airport-transfer",
    note: "Airport pickup · 35 km to city center",
  },
  {
    id: "jed-airport-makkah",
    from: "King Abdulaziz Intl Airport (JED)",
    to: "Makkah",
    fromRegion: "Jeddah Airport",
    toRegion: "Makkah",
    durationHours: 1.2,
    distanceKm: 100,
    service: "airport-transfer",
    note: "Pilgrim transfer · Haramain route",
  },
  {
    id: "jed-makkah",
    from: "Jeddah",
    to: "Makkah",
    fromRegion: "Jeddah",
    toRegion: "Makkah",
    durationHours: 1.2,
    distanceKm: 80,
    service: "city-to-city",
    note: "Umrah pilgrimage route",
  },
  {
    id: "med-airport-madinah",
    from: "Prince Mohammad Airport (MED)",
    to: "Al-Masjid an-Nabawi",
    fromRegion: "Madinah Airport",
    toRegion: "Madinah",
    durationHours: 0.4,
    distanceKm: 15,
    service: "airport-transfer",
    note: "Quick city transfer",
  },
  {
    id: "dmm-ruh",
    from: "Dammam",
    to: "Riyadh",
    fromRegion: "Eastern Province",
    toRegion: "Riyadh",
    durationHours: 4.5,
    distanceKm: 400,
    service: "city-to-city",
    note: "Eastern Province commute",
  },
  {
    id: "ruh-diriyah",
    from: "Riyadh",
    to: "Diriyah (At-Turaif)",
    fromRegion: "Riyadh",
    toRegion: "Riyadh Province",
    durationHours: 0.5,
    distanceKm: 20,
    service: "hourly-car-service",
    note: "Heritage tour · half-day hire recommended",
  },
  {
    id: "jeddah-al-balad",
    from: "Jeddah Corniche",
    to: "Historic Al-Balad",
    fromRegion: "Jeddah",
    toRegion: "Jeddah",
    durationHours: 0.4,
    distanceKm: 12,
    service: "hourly-car-service",
    note: "UNESCO heritage tour",
  },
];

/** Hourly duration options for the "By the hour" tab */
export const HOURLY_DURATION_OPTIONS = [
  { value: 2, label: "2 hours", note: "Minimum" },
  { value: 3, label: "3 hours" },
  { value: 4, label: "4 hours" },
  { value: 6, label: "6 hours" },
  { value: 8, label: "8 hours (full day)" },
  { value: 10, label: "10 hours" },
  { value: 12, label: "12 hours" },
];
