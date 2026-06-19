/**
 * AMHAR — Database seed script v2
 * Run with: bun run scripts/seed.ts
 *
 * Seeds:
 *  - 3 admin users (super_admin, manager, operator)
 *  - 10 luxury vehicles with realistic pricing, images, amenities
 *  - 8-15 reviews per vehicle (100+ total reviews)
 *  - 10 client testimonials (site-level)
 *  - 6 sample leads across all statuses
 *
 * Uses the PGlite-backed Prisma client (same as src/lib/db.ts) so the seed
 * writes to the local PGlite Postgres database.
 */
import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";
import { PrismaClient } from "@prisma/client";

const DATA_DIR = "/home/z/my-project/db/pglite";

const pglite = new PGlite({ dataDir: DATA_DIR });
await pglite.waitReady;
const adapter = new PrismaPGlite(pglite);
const db = new PrismaClient({ adapter });

async function main() {
  console.log("→ Seeding AMHAR database v2…");

  // ---------------- Users ----------------
  const superAdmin = await db.user.upsert({
    where: { email: "mir@amharksa.com" },
    update: {},
    create: {
      email: "mir@amharksa.com",
      name: "Mir Abdullah",
      role: "super_admin",
      isActive: true,
    },
  });

  const manager = await db.user.upsert({
    where: { email: "basit@amharksa.com" },
    update: {},
    create: {
      email: "basit@amharksa.com",
      name: "Basit Khan",
      role: "manager",
      isActive: true,
    },
  });

  const operator = await db.user.upsert({
    where: { email: "murtada@amharksa.com" },
    update: {},
    create: {
      email: "murtada@amharksa.com",
      name: "Murtada Ali",
      role: "operator",
      isActive: true,
    },
  });

  console.log(`  ✓ Users: ${[superAdmin.name, manager.name, operator.name].join(", ")}`);

  // ---------------- Fleet ----------------
  const fleetData = [
    {
      name: "Mercedes-Benz S-Class",
      slug: "mercedes-s-class",
      category: "sedan",
      vehicleClass: "first_class",
      brand: "Mercedes-Benz",
      model: "S 580",
      year: 2024,
      seats: 3,
      luggage: 3,
      carryOn: 2,
      baseFare: 850,
      taxRate: 0.15,
      description: "The definitive executive sedan. Cutting-edge comfort with the legendary S-Class presence. Burmester audio, massage seats, ambient lighting.",
      imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1600&q=80",
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
      ],
      features: ["meet_greet", "flight_tracking", "free_waiting", "free_cancellation", "phone_chargers", "bottled_water", "sanitizing_wipes", "premium_interior", "wifi", "leather_seats"],
      displayOrder: 1,
      isVisible: true,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: "Mercedes-Benz EQE",
      slug: "mercedes-eqe",
      category: "sedan",
      vehicleClass: "business_class",
      brand: "Mercedes-Benz",
      model: "EQE 350",
      year: 2024,
      seats: 3,
      luggage: 2,
      carryOn: 2,
      baseFare: 650,
      taxRate: 0.15,
      description: "All-electric executive sedan. Whisper-quiet, zero emissions, with the range for cross-city journeys.",
      imageUrl: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1600&q=80",
      ],
      features: ["meet_greet", "flight_tracking", "free_waiting", "free_cancellation", "phone_chargers", "bottled_water", "premium_interior", "wifi", "climate_control", "leather_seats"],
      displayOrder: 2,
      isVisible: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "Mercedes-Benz V-Class",
      slug: "mercedes-v-class",
      category: "van",
      vehicleClass: "business_van",
      brand: "Mercedes-Benz",
      model: "V 250",
      year: 2024,
      seats: 7,
      luggage: 7,
      carryOn: 4,
      baseFare: 950,
      taxRate: 0.15,
      description: "First-class travel for groups up to 7. Configurable captain's chairs, conference seating, privacy partition.",
      imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1600&q=80",
      ],
      features: ["meet_greet", "flight_tracking", "free_waiting", "free_cancellation", "phone_chargers", "bottled_water", "sanitizing_wipes", "premium_interior", "wifi", "climate_control", "leather_seats", "privacy_partition"],
      displayOrder: 10,
      isVisible: true,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: "BMW 7 Series",
      slug: "bmw-7-series",
      category: "sedan",
      vehicleClass: "first_class",
      brand: "BMW",
      model: "750i xDrive",
      year: 2024,
      seats: 3,
      luggage: 3,
      carryOn: 2,
      baseFare: 820,
      taxRate: 0.15,
      description: "Dynamic, refined, and quietly assertive. The driver's luxury sedan with executive lounge seating and Sky Lounge roof.",
      imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1600&q=80",
      ],
      features: ["meet_greet", "flight_tracking", "free_waiting", "free_cancellation", "phone_chargers", "bottled_water", "sanitizing_wipes", "premium_interior", "wifi", "leather_seats", "climate_control"],
      displayOrder: 3,
      isVisible: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "BMW i7",
      slug: "bmw-i7",
      category: "sedan",
      vehicleClass: "first_class",
      brand: "BMW",
      model: "i7 xDrive60",
      year: 2024,
      seats: 3,
      luggage: 3,
      carryOn: 2,
      baseFare: 920,
      taxRate: 0.15,
      description: "The electric flagship. Zero-emission luxury with the BMW Theatre Screen and Executive Lounge rear seats.",
      imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
      ],
      features: ["meet_greet", "flight_tracking", "free_waiting", "free_cancellation", "phone_chargers", "bottled_water", "sanitizing_wipes", "premium_interior", "wifi", "leather_seats", "climate_control"],
      displayOrder: 4,
      isVisible: true,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: "Audi A8 L",
      slug: "audi-a8-l",
      category: "sedan",
      vehicleClass: "first_class",
      brand: "Audi",
      model: "A8 L 60 TFSI",
      year: 2024,
      seats: 3,
      luggage: 3,
      carryOn: 2,
      baseFare: 780,
      taxRate: 0.15,
      description: "Quietly technical, impeccably finished. The thinking person's luxury sedan with Bang & Olufsen audio and heated rear seats with foot massagers.",
      imageUrl: "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1600&q=80",
      ],
      features: ["meet_greet", "flight_tracking", "free_waiting", "free_cancellation", "phone_chargers", "bottled_water", "sanitizing_wipes", "premium_interior", "wifi", "leather_seats", "climate_control"],
      displayOrder: 5,
      isVisible: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "Lexus ES 350",
      slug: "lexus-es-350",
      category: "sedan",
      vehicleClass: "business_class",
      brand: "Lexus",
      model: "ES 350 Luxury",
      year: 2024,
      seats: 3,
      luggage: 2,
      carryOn: 2,
      baseFare: 550,
      taxRate: 0.15,
      description: "Japanese omotenashi hospitality in motion. Refined, serene, and famously reliable.",
      imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
      ],
      features: ["meet_greet", "flight_tracking", "free_waiting", "free_cancellation", "phone_chargers", "bottled_water", "premium_interior", "wifi", "climate_control", "leather_seats"],
      displayOrder: 6,
      isVisible: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "Cadillac Escalade",
      slug: "cadillac-escalade",
      category: "suv",
      vehicleClass: "first_class",
      brand: "Cadillac",
      model: "Escalade Premium Luxury",
      year: 2024,
      seats: 6,
      luggage: 6,
      carryOn: 4,
      baseFare: 1100,
      taxRate: 0.15,
      description: "American luxury, writ large. Presence, space, and authority in equal measure. Curved OLED display and AKG studio audio.",
      imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
      ],
      features: ["meet_greet", "flight_tracking", "free_waiting", "free_cancellation", "phone_chargers", "bottled_water", "sanitizing_wipes", "premium_interior", "wifi", "leather_seats", "climate_control"],
      displayOrder: 20,
      isVisible: true,
      isAvailable: true,
      isFeatured: true,
    },
    {
      name: "GMC Yukon XL",
      slug: "gmc-yukon-xl",
      category: "suv",
      vehicleClass: "business_van",
      brand: "GMC",
      model: "Yukon XL Denali",
      year: 2024,
      seats: 7,
      luggage: 7,
      carryOn: 4,
      baseFare: 880,
      taxRate: 0.15,
      description: "Spacious, refined, and capable. The understated American SUV — ideal for families and groups.",
      imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1600&q=80",
      ],
      features: ["meet_greet", "flight_tracking", "free_waiting", "free_cancellation", "phone_chargers", "bottled_water", "premium_interior", "wifi", "climate_control"],
      displayOrder: 21,
      isVisible: true,
      isAvailable: true,
      isFeatured: false,
    },
    {
      name: "Range Rover Autobiography",
      slug: "range-rover-autobiography",
      category: "suv",
      vehicleClass: "first_class",
      brand: "Land Rover",
      model: "Range Rover Autobiography",
      year: 2024,
      seats: 4,
      luggage: 4,
      carryOn: 3,
      baseFare: 1200,
      taxRate: 0.15,
      description: "British luxury with go-anywhere capability. Equally at home at the hotel or the dunes. Meridian audio, executive Class rear seats.",
      imageUrl: "https://images.unsplash.com/photo-1606152421811-aa911307c6ae?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [
        "https://images.unsplash.com/photo-1606152421811-aa911307c6ae?auto=format&fit=crop&w=1600&q=80",
      ],
      features: ["meet_greet", "flight_tracking", "free_waiting", "free_cancellation", "phone_chargers", "bottled_water", "sanitizing_wipes", "premium_interior", "wifi", "leather_seats", "climate_control"],
      displayOrder: 22,
      isVisible: true,
      isAvailable: true,
      isFeatured: true,
    },
  ];

  for (const v of fleetData) {
    const existing = await db.fleet.findUnique({ where: { slug: v.slug } });
    if (!existing) {
      await db.fleet.create({
        data: {
          ...v,
          // Postgres native arrays — pass directly
          galleryImages: v.galleryImages,
          features: v.features,
        } as any,
      });
    }
  }
  console.log(`  ✓ Fleet: ${fleetData.length} vehicles`);

  // ---------------- Per-vehicle Reviews ----------------
  const reviewNames = [
    "James Whitfield", "Aisha Al-Otaibi", "Chen Wei", "Mohammed Al-Faisal", "Sofia Romano",
    "Hiroshi Tanaka", "Ali Abdallah", "Rabbi Hasan", "Emma Lou", "Tahani Al-Bassam",
    "Abdulaziz Alzouman", "Mathi Venkat", "Engr Abbas Khan", "Mike Accardo", "Sarah Mitchell",
    "Khalid Al-Saud", "Lena Müller", "Pierre Dubois", "Fatima Al-Zahra", "Daniel Cohen",
  ];
  const reviewCountries = [
    "Saudi Arabia", "United Kingdom", "China", "Saudi Arabia", "Italy",
    "Japan", "Jordan", "Pakistan", "United States", "Saudi Arabia",
    "Saudi Arabia", "India", "Pakistan", "United States", "Australia",
    "Saudi Arabia", "Germany", "France", "Bahrain", "Israel",
  ];
  const reviewTemplates = [
    { title: "Outstanding service", body: "The chauffeur was professional, punctual, and made the journey effortless. Vehicle was immaculate. Will book again." },
    { title: "Five-star experience", body: "From booking to drop-off, everything was seamless. The driver arrived early and was extremely courteous." },
    { title: "Highly recommended", body: "Excellent service from start to finish. The vehicle was clean, comfortable, and the chauffeur knew every back route." },
    { title: "Premium and reliable", body: "I've used this service multiple times for business travel. Consistently excellent. The drivers speak good English." },
    { title: "Best in Riyadh", body: "By far the best chauffeur service I've used in Saudi Arabia. The Mercedes was pristine and the driver was outstanding." },
    { title: "Effortless airport pickup", body: "Flight tracking worked perfectly — the driver was waiting exactly when I landed. Meet & greet was a nice touch." },
    { title: "Worth every riyal", body: "Yes it's premium-priced but the experience justifies it. Discreet, professional, and reliable." },
    { title: "Corporate favourite", body: "We use this for all our executive transport. Never had an issue. The admin portal makes managing bookings easy." },
    { title: "Smooth and discreet", body: "The chauffeur was discreet, the car was whisper-quiet, and I could take calls in privacy. Perfect." },
    { title: "Will use again", body: "Booked for a full day of meetings. Driver was patient, car was comfortable, scheduling was flexible." },
    { title: "Excellent for VIPs", body: "We booked this for a visiting executive. The protocol was impeccable and the vehicle was top-tier." },
    { title: "Smooth wedding transfer", body: "Used for our wedding. The Rolls Royce arrived spotless, driver was professional. Made the day feel special." },
    { title: "Reliable for early flights", body: "4am pickup for an early flight. Driver arrived 10 minutes early, no hassle, smooth ride to the airport." },
    { title: "Top-notch chauffeur", body: "Mujahid was my driver — went out of his way to make the multi-day trip smooth. 5+ stars." },
    { title: "Impressed", body: "First time using a chauffeur service in Riyadh. Exceeded expectations. Will recommend to colleagues." },
  ];

  const fleets = await db.fleet.findMany();
  let reviewCount = 0;
  for (const fleet of fleets) {
    // Generate 8-15 reviews per vehicle
    const numReviews = 8 + Math.floor(Math.random() * 8); // 8-15
    for (let i = 0; i < numReviews; i++) {
      const nameIdx = (fleets.indexOf(fleet) * 7 + i) % reviewNames.length;
      const template = reviewTemplates[(fleets.indexOf(fleet) * 5 + i) % reviewTemplates.length];
      const rating = i < numReviews * 0.7 ? 5 : i < numReviews * 0.95 ? 4 : 3; // mostly 5s
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() - Math.floor(Math.random() * 180));

      const existing = await db.fleetReview.findFirst({
        where: { fleetId: fleet.id, customerName: reviewNames[nameIdx], body: template.body },
      });
      if (existing) continue;

      await db.fleetReview.create({
        data: {
          fleetId: fleet.id,
          customerName: reviewNames[nameIdx],
          country: reviewCountries[nameIdx],
          rating,
          title: template.title,
          body: template.body,
          reviewDate,
          isVerified: true,
          isApproved: true,
        },
      });
      reviewCount++;
    }
  }
  console.log(`  ✓ Fleet reviews: ${reviewCount} reviews across ${fleets.length} vehicles`);

  // ---------------- Site-level Reviews ----------------
  const siteReviewData = [
    { clientName: "Ali Abdallah", clientTitle: "Corporate Delegate", rating: 5, featured: true, body: "Thank you for the excellent hospitality and outstanding service provided by the team. Special thanks to Mr. Murtada and Mr. Basit for their support and warm reception from the airport until the end of the trip." },
    { clientName: "Rabbi Hasan", clientTitle: "Business Traveller", rating: 5, featured: true, body: "I had a great experience with this company. The driver was extremely professional, respectful, and made the entire journey comfortable and enjoyable. I truly appreciate the excellent service and would highly recommend others to use their services." },
    { clientName: "Emma Lou", clientTitle: "Returning Client", rating: 5, body: "I have used our wonderful trusted limo service many times since I have been in Saudi! So respectful and graceful — highly recommended without a doubt." },
    { clientName: "Tahani B", clientTitle: "Corporate Travel Manager", rating: 5, featured: true, body: "We used Amhar chauffeur service for a full-day, multi-day company booking, and the experience was excellent from start to finish. The drivers were professional, punctual, and courteous. Highly recommend for corporate transportation." },
    { clientName: "Abdulaziz Alzouman", clientTitle: "VIP Client", rating: 5, body: "Absolutely outstanding chauffeur service. The company is professional, fast, and provides a truly high-end experience from start to finish. Highly recommended." },
    { clientName: "Mathi Venkat", clientTitle: "IHI Corporation", rating: 5, body: "We booked for a Riyadh trip and the service was very, very good. Our driver Basit Khan is a very nice guy. We are happy to say — the best." },
    { clientName: "Engr Abbas Khan", clientTitle: "Executive", rating: 5, body: "I appreciate the service provided by Amhar Chauffeur. It was prompt, clean, and respectful. Thank you to the Amhar Service team." },
    { clientName: "Mike Accardo", clientTitle: "Business Traveller", rating: 5, body: "Mujahid was my driver this week — my first time in Riyadh for business. He was fantastic and went out of his way to make my multi-day travel as smooth as possible. Five stars and then some." },
    { clientName: "Sarah Mitchell", clientTitle: "Tourist", rating: 5, body: "Just used Amhar for a tour of Diriyah. Wonderful service and the Mercedes S-Class was immaculate. Our driver spoke excellent English." },
    { clientName: "Khalid Al-Saud", clientTitle: "VIP", rating: 5, body: "Outstanding service from booking to drop-off. The Range Rover was pristine and the chauffeur knew every back route. Will use again." },
  ];

  for (const [i, r] of siteReviewData.entries()) {
    const existing = await db.review.findFirst({ where: { clientName: r.clientName } });
    if (!existing) {
      await db.review.create({
        data: {
          clientName: r.clientName,
          clientTitle: r.clientTitle,
          rating: r.rating,
          body: r.body,
          source: "direct",
          isApproved: i < 8,
          isFeatured: r.featured ?? false,
          createdAt: new Date(Date.now() - i * 86400000 * 3),
        },
      });
    }
  }
  console.log(`  ✓ Site reviews: ${siteReviewData.length} (${siteReviewData.length - 2} approved, 2 pending)`);

  // ---------------- Sample Leads ----------------
  const leadData = [
    { fullName: "James Whitfield", email: "j.whitfield@example.com", phone: "501234567", pickup: "King Khalid International Airport, T1", destination: "The Ritz-Carlton, Riyadh", date: 7, time: "14:30", cat: "sedan", pax: 2, lug: 3, status: "new" },
    { fullName: "Aisha Al-Otaibi", email: "aisha@example.com", phone: "552345678", pickup: "Four Seasons, Riyadh", destination: "King Abdulaziz Conference Center", date: 3, time: "08:00", cat: "suv", pax: 4, lug: 2, status: "contacted", assigned: manager.id },
    { fullName: "Chen Wei", email: "chen.wei@example.com", phone: "563456789", pickup: "King Khalid International Airport, T5", destination: "Al Faisaliah Tower", date: 1, time: "22:15", cat: "sedan", pax: 1, lug: 2, status: "quoted", assigned: superAdmin.id },
    { fullName: "Mohammed Al-Faisal", email: "m.alfaisal@example.com", phone: "544567890", pickup: "Burj Rafal Hotel", destination: "King Khalid International Airport", date: -2, time: "06:00", cat: "van", pax: 8, lug: 10, status: "confirmed", assigned: manager.id },
    { fullName: "Sofia Romano", email: "s.romano@example.com", phone: "505678901", pickup: "Riyadh Park Mall", destination: "Diriyah Gate", date: 10, time: "17:30", cat: "suv", pax: 3, lug: 1, status: "new" },
    { fullName: "Hiroshi Tanaka", email: "h.tanaka@example.com", phone: "506789012", pickup: "Hotel Intercontinental", destination: "Bahrain (cross-border)", date: 14, time: "07:00", cat: "sedan", pax: 2, lug: 4, status: "cancelled", assigned: operator.id },
  ];

  for (const l of leadData) {
    const existing = await db.lead.findFirst({ where: { fullName: l.fullName } });
    if (existing) continue;
    const dt = new Date();
    dt.setDate(dt.getDate() + l.date);
    const created = await db.lead.create({
      data: {
        reference: `AMH-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
        status: l.status,
        fullName: l.fullName,
        email: l.email,
        phone: l.phone,
        countryCode: "+966",
        pickup: l.pickup,
        destination: l.destination,
        pickupDate: dt,
        pickupTime: l.time,
        vehicleCategory: l.cat,
        vehicleId: null,
        passengers: l.pax,
        luggage: l.lug,
        notes: null,
        assignedToId: l.assigned ?? null,
        createdAt: new Date(Date.now() - Math.random() * 14 * 86400000),
      },
    });

    await db.activityLog.create({
      data: {
        userId: null,
        action: "lead.created",
        entityType: "lead",
        entityId: created.id,
        leadId: created.id,
        metadata: { reference: created.reference, fullName: created.fullName } as any,
      },
    });

    if (l.assigned) {
      await db.leadNote.create({
        data: {
          leadId: created.id,
          authorId: l.assigned,
          body: `Lead assigned to operator.`,
          kind: "assignment",
        },
      });
    }

    if (l.status !== "new") {
      await db.leadNote.create({
        data: {
          leadId: created.id,
          authorId: l.assigned ?? manager.id,
          body: `Status changed from "new" to "${l.status}".`,
          kind: "status_change",
        },
      });
    }
  }
  console.log(`  ✓ Sample leads: ${leadData.length}`);

  console.log("\n✓ Seed v2 complete.");
  console.log("  Admin emails: mir@amharksa.com, basit@amharksa.com, murtada@amharksa.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
    await pglite.close();
  });
