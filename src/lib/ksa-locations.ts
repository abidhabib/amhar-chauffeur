/**
 * KSA Locations — comprehensive dataset of Saudi Arabian cities, airports,
 * hotels, and landmarks for the booking widget autocomplete.
 *
 * Scope: Kingdom of Saudi Arabia only (per project requirement).
 */

export type LocationType = "city" | "airport" | "hotel" | "landmark" | "station";

export interface KsaLocation {
  id: string;
  name: string;
  type: LocationType;
  region: string;
  /** Short hint shown under the name in the dropdown */
  hint?: string;
  /** IATA code for airports */
  code?: string;
}

export const KSA_LOCATIONS: KsaLocation[] = [
  // ---- Cities ----
  { id: "riyadh", name: "Riyadh", type: "city", region: "Riyadh Province", hint: "Capital of Saudi Arabia" },
  { id: "jeddah", name: "Jeddah", type: "city", region: "Makkah Province", hint: "Gateway to Makkah" },
  { id: "mecca", name: "Makkah (Mecca)", type: "city", region: "Makkah Province", hint: "Holy City" },
  { id: "medina", name: "Madinah (Medina)", type: "city", region: "Madinah Province", hint: "Holy City" },
  { id: "dammam", name: "Dammam", type: "city", region: "Eastern Province", hint: "Eastern Province capital" },
  { id: "khobar", name: "Al Khobar", type: "city", region: "Eastern Province", hint: "Persian Gulf coast" },
  { id: "dhahran", name: "Dhahran", type: "city", region: "Eastern Province", hint: "Saudi Aramco HQ" },
  { id: "taif", name: "Taif", type: "city", region: "Makkah Province", hint: "Mountain resort city" },
  { id: "tabuk", name: "Tabuk", type: "city", region: "Tabuk Province", hint: "Northwest Saudi Arabia" },
  { id: "abha", name: "Abha", type: "city", region: "Asir Province", hint: "Asir mountains" },
  { id: "khamis-mushait", name: "Khamis Mushait", type: "city", region: "Asir Province" },
  { id: "buraidah", name: "Buraidah", type: "city", region: "Qassim Province" },
  { id: "unaizah", name: "Unaizah", type: "city", region: "Qassim Province" },
  { id: "hail", name: "Hail", type: "city", region: "Ha'il Province" },
  { id: "najran", name: "Najran", type: "city", region: "Najran Province" },
  { id: "jizan", name: "Jizan", type: "city", region: "Jazan Province" },
  { id: "yanbu", name: "Yanbu", type: "city", region: "Madinah Province", hint: "Red Sea port" },
  { id: "jubail", name: "Jubail", type: "city", region: "Eastern Province", hint: "Industrial city" },
  { id: "hafr-al-batin", name: "Hafar Al-Batin", type: "city", region: "Eastern Province" },
  { id: "arar", name: "Arar", type: "city", region: "Northern Borders Province" },
  { id: "skaka", name: "Sakaka", type: "city", region: "Al Jawf Province" },
  { id: "bahah", name: "Al Bahah", type: "city", region: "Al Bahah Province" },

  // ---- Airports ----
  { id: "ruh", name: "King Khalid International Airport", type: "airport", region: "Riyadh", code: "RUH", hint: "Riyadh · RUH" },
  { id: "jed", name: "King Abdulaziz International Airport", type: "airport", region: "Jeddah", code: "JED", hint: "Jeddah · JED" },
  { id: "med", name: "Prince Mohammad bin Abdulaziz Airport", type: "airport", region: "Madinah", code: "MED", hint: "Madinah · MED" },
  { id: "dmm", name: "King Fahd International Airport", type: "airport", region: "Dammam", code: "DMM", hint: "Dammam · DMM" },
  { id: "ahb", name: "Abha Regional Airport", type: "airport", region: "Abha", code: "AHB", hint: "Abha · AHB" },
  { id: "tuu", name: "Tabuk Regional Airport", type: "airport", region: "Tabuk", code: "TUU", hint: "Tabuk · TUU" },
  { id: "ync", name: "Yanbu Airport", type: "airport", region: "Yanbu", code: "YNC", hint: "Yanbu · YNC" },
  { id: "giz", name: "Jazan Regional Airport", type: "airport", region: "Jizan", code: "GIZ", hint: "Jizan · GIZ" },
  { id: "hasa", name: "Al-Ahsa International Airport", type: "airport", region: "Hofuf", code: "HOF", hint: "Hofuf · HOF" },
  { id: "qqq", name: "Prince Nayef bin Abdulaziz Airport", type: "airport", region: "Qassim", code: "ELQ", hint: "Buraidah · ELQ" },

  // ---- Major Hotels (Riyadh) ----
  { id: "ritz-riyadh", name: "The Ritz-Carlton, Riyadh", type: "hotel", region: "Riyadh", hint: "Hittin District" },
  { id: "four-seasons-riyadh", name: "Four Seasons Hotel Riyadh", type: "hotel", region: "Riyadh", hint: "Kingdom Centre" },
  { id: "intercon-riyadh", name: "InterContinental Riyadh", type: "hotel", region: "Riyadh", hint: "Al Maather District" },
  { id: "burj-rafal", name: "Burj Rafal Hotel", type: "hotel", region: "Riyadh", hint: "Kempinski · Al Sahafa" },
  { id: "fairmont-riyadh", name: "Fairmont Riyadh", type: "hotel", region: "Riyadh", hint: "King Abdullah Financial District" },
  { id: "mandarin-riyadh", name: "Mandarin Oriental Al Faisaliah", type: "hotel", region: "Riyadh", hint: "Al Olaya District" },
  { id: "hyatt-riyadh", name: "Hyatt Regency Riyadh", type: "hotel", region: "Riyadh", hint: "Olaya District" },
  { id: "marriott-riyadh", name: "Riyadh Marriott Hotel", type: "hotel", region: "Riyadh", hint: "Diplomatic Quarter" },

  // ---- Major Hotels (Jeddah) ----
  { id: "hilton-jeddah", name: "Hilton Jeddah", type: "hotel", region: "Jeddah", hint: "North Corniche" },
  { id: "waldorf-jeddah", name: "Waldorf Astoria Jeddah", type: "hotel", region: "Jeddah", hint: "Al Shati District" },
  { id: "ritz-jeddah", name: "The Ritz-Carlton, Jeddah", type: "hotel", region: "Jeddah", hint: "Al Shati District" },
  { id: "intercon-jeddah", name: "InterContinental Jeddah", type: "hotel", region: "Jeddah", hint: "Madinah Road" },
  { id: "four-points-jeddah", name: "Four Points by Sheraton Jeddah", type: "hotel", region: "Jeddah", hint: "Al Andalus District" },

  // ---- Major Hotels (Makkah / Madinah) ----
  { id: "clock-tower-makkah", name: "Makkah Clock Tower Hotel", type: "hotel", region: "Makkah", hint: "Adjacent to Masjid al-Haram" },
  { id: "hilton-makkah", name: "Hilton Suites Makkah", type: "hotel", region: "Makkah", hint: "Holy Mosque view" },
  { id: "intercon-madinah", name: "InterContinental Dar Al Iman", type: "hotel", region: "Madinah", hint: "Adjacent to Prophet's Mosque" },
  { id: "dar-al-taqwa", name: "Dar Al Taqwa Hotel", type: "hotel", region: "Madinah", hint: "Opposite Prophet's Mosque" },

  // ---- Major Hotels (Eastern Province) ----
  { id: "sheraton-dammam", name: "Sheraton Dammam Hotel", type: "hotel", region: "Dammam", hint: "Corniche" },
  { id: "meridian-khobar", name: "Le Méridien Al Khobar", type: "hotel", region: "Al Khobar", hint: "Corniche" },
  { id: "movenpick-khobar", name: "Mövenpick Hotel Al Khobar", type: "hotel", region: "Al Khobar", hint: "Prince Turkey Street" },

  // ---- Landmarks ----
  { id: "kingdom-centre", name: "Kingdom Centre Tower", type: "landmark", region: "Riyadh", hint: "Iconic skyscraper" },
  { id: "al-faisaliah", name: "Al Faisaliah Tower", type: "landmark", region: "Riyadh", hint: "Olaya District" },
  { id: "diriyah", name: "Diriyah / At-Turaif", type: "landmark", region: "Riyadh", hint: "UNESCO World Heritage" },
  { id: "national-museum", name: "King Abdulaziz Historical Center", type: "landmark", region: "Riyadh", hint: "National Museum" },
  { id: "boulevard-riyadh", name: "Boulevard Riyadh City", type: "landmark", region: "Riyadh", hint: "Entertainment district" },
  { id: "kafdh", name: "King Fahd Fountain", type: "landmark", region: "Jeddah", hint: "World's tallest fountain" },
  { id: "al-balad", name: "Al-Balad (Historic Jeddah)", type: "landmark", region: "Jeddah", hint: "UNESCO World Heritage" },
  { id: "haram-makkah", name: "Masjid al-Haram", type: "landmark", region: "Makkah", hint: "The Great Mosque" },
  { id: "haram-madinah", name: "Al-Masjid an-Nabawi", type: "landmark", region: "Madinah", hint: "The Prophet's Mosque" },
  { id: "kaec", name: "King Abdullah Economic City", type: "landmark", region: "Rabigh", hint: "New economic city" },
  { id: "neom", name: "NEOM (entry point)", type: "landmark", region: "Tabuk", hint: "Future mega-city" },
  { id: "edge-world", name: "Edge of the World (Jebel Fihrayn)", type: "landmark", region: "Riyadh Province", hint: "Desert escarpment" },

  // ---- Train Stations (Haramain + Riyadh Metro hubs) ----
  { id: "haramain-makkah", name: "Makkah Haramain Train Station", type: "station", region: "Makkah", hint: "High-speed rail" },
  { id: "haramain-madinah", name: "Madinah Haramain Train Station", type: "station", region: "Madinah", hint: "High-speed rail" },
  { id: "haramain-jeddah", name: "Jeddah Haramain Train Station", type: "station", region: "Jeddah", hint: "High-speed rail" },
  { id: "haramain-airport", name: "KAIA Haramain Train Station", type: "station", region: "Jeddah", hint: "King Abdulaziz Airport" },
  { id: "north-riyadh", name: "Riyadh North Train Station", type: "station", region: "Riyadh", hint: "SAR rail network" },
];

export const LOCATION_TYPE_LABEL: Record<LocationType, string> = {
  city: "City",
  airport: "Airport",
  hotel: "Hotel",
  landmark: "Landmark",
  station: "Station",
};

export const LOCATION_TYPE_ICON: Record<LocationType, string> = {
  city: "🏙️",
  airport: "✈️",
  hotel: "🏨",
  landmark: "📍",
  station: "🚆",
};

/**
 * Search KSA locations by query string.
 * Returns up to `limit` matches sorted by relevance.
 */
export function searchKsaLocations(query: string, limit = 8): KsaLocation[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    // Default: show top cities + airports
    const defaults = KSA_LOCATIONS.filter(
      (l) =>
        l.id === "riyadh" ||
        l.id === "jeddah" ||
        l.id === "mecca" ||
        l.id === "medina" ||
        l.id === "dammam" ||
        l.id === "ruh" ||
        l.id === "jed" ||
        l.id === "med-airport",
    );
    return defaults.slice(0, limit);
  }

  const matches = KSA_LOCATIONS.filter((l) => {
    const haystack = [
      l.name,
      l.region,
      l.hint ?? "",
      l.code ?? "",
      l.type,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });

  // Prioritize: starts-with match > city > airport > other
  return matches
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
      if (aStarts !== bStarts) return aStarts - bStarts;

      const typePriority: Record<LocationType, number> = {
        city: 0,
        airport: 1,
        hotel: 2,
        landmark: 3,
        station: 4,
      };
      return typePriority[a.type] - typePriority[b.type];
    })
    .slice(0, limit);
}

/**
 * Get a location by ID.
 */
export function getKsaLocation(id: string): KsaLocation | undefined {
  return KSA_LOCATIONS.find((l) => l.id === id);
}
