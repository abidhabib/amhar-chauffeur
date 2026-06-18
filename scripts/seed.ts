/**
 * AMHAR — Database seed script
 * Run with: bun run scripts/seed.ts
 *
 * Seeds:
 *  - 1 super_admin user (the operator)
 *  - 2 staff users (manager, operator)
 *  - 16 luxury fleet vehicles
 *  - 8 client testimonials (approved)
 *  - 2 pending reviews
 *  - 6 sample leads (across statuses)
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("→ Seeding AMHAR database…");

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
    // Sedans
    { name: "Rolls Royce Phantom", slug: "rolls-royce", brand: "Rolls Royce", category: "sedan", seats: 3, luggage: 2, order: 1,
      description: "Handcrafted luxury. Whisper-quiet ride. The benchmark of automotive excellence.",
      imageUrl: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=1200&q=80",
      features: ["Privacy partition", "Handcrafted interior", "Whisper-quiet cabin", "Champagne console"] },
    { name: "Mercedes S-Class", slug: "mercedes-s-class", brand: "Mercedes-Benz", category: "sedan", seats: 3, luggage: 2, order: 2,
      description: "The definitive executive sedan. Cutting-edge comfort, timeless presence.",
      imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      features: ["Massage seats", "Burmester audio", "Ambient lighting", "Wi-Fi"] },
    { name: "BMW 7 Series", slug: "bmw-7", brand: "BMW", category: "sedan", seats: 3, luggage: 2, order: 3,
      description: "Dynamic, refined, and quietly assertive. The driver's luxury sedan.",
      imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80",
      features: ["Executive lounge seating", "Sky Lounge roof", "Wi-Fi", "Bowers & Wilkins audio"] },
    { name: "Audi A8", slug: "audi-a8", brand: "Audi", category: "sedan", seats: 3, luggage: 2, order: 4,
      description: "Quietly technical, impeccably finished. The thinking person's luxury sedan.",
      imageUrl: "https://images.unsplash.com/photo-1606016159991-d4b29a55b6a2?auto=format&fit=crop&w=1200&q=80",
      features: ["Bang & Olufsen audio", "Massage seats", "Quattro all-wheel drive", "Wi-Fi"] },
    { name: "Lexus ES", slug: "lexus-es", brand: "Lexus", category: "sedan", seats: 3, luggage: 2, order: 5,
      description: "Japanese omotenaki hospitality in motion. Refined and serene.",
      imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      features: ["Mark Levinson audio", "Hybrid powertrain", "Semi-aniline leather", "Wi-Fi"] },
    { name: "Range Rover Autobiography", slug: "range-rover", brand: "Land Rover", category: "sedan", seats: 3, luggage: 3, order: 6,
      description: "British luxury with go-anywhere capability. Equally at home at the hotel or the dunes.",
      imageUrl: "https://images.unsplash.com/photo-1606152421811-aa911307c6ae?auto=format&fit=crop&w=1200&q=80",
      features: ["Meridian audio", "Executive seating", "All-terrain capability", "Wi-Fi"] },

    // SUVs
    { name: "Cadillac Escalade", slug: "cadillac-escalade", brand: "Cadillac", category: "suv", seats: 5, luggage: 5, order: 10,
      description: "American luxury, writ large. Presence, space, and authority in equal measure.",
      imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      features: ["Curved OLED display", "AKG audio", "Super Cruise", "Wi-Fi"] },
    { name: "GMC Yukon Denali", slug: "gmc-yukon", brand: "GMC", category: "suv", seats: 5, luggage: 5, order: 11,
      description: "Spacious, refined, and capable. The understated American SUV.",
      imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      features: ["Bose audio", "Heated seats", "Tri-zone climate", "Wi-Fi"] },
    { name: "Chevrolet Tahoe", slug: "chevrolet-tahoe", brand: "Chevrolet", category: "suv", seats: 5, luggage: 5, order: 12,
      description: "Dependable, spacious, capable. The workhorse of the SUV fleet.",
      imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80",
      features: ["Heated seats", "Tri-zone climate", "Apple CarPlay", "Wi-Fi"] },

    // Vans
    { name: "Mercedes Sprinter", slug: "mercedes-sprinter", brand: "Mercedes-Benz", category: "van", seats: 15, luggage: 15, order: 20,
      description: "First-class travel for groups. Configurable seating, refined finishes.",
      imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      features: ["Leather captain's chairs", "Conference seating", "Wi-Fi", "Privacy glass"] },
    { name: "Mercedes V-Class", slug: "mercedes-vino", brand: "Mercedes-Benz", category: "van", seats: 6, luggage: 6, order: 21,
      description: "Intimate luxury for small groups. The private jet of the road.",
      imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      features: ["Captain's chairs", "Privacy partition", "Wi-Fi", "Ambient lighting"] },
    { name: "Toyota Hiace", slug: "toyota-hiace", brand: "Toyota", category: "van", seats: 14, luggage: 14, order: 22,
      description: "Reliable, spacious, efficient. Group transport, simplified.",
      imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      features: ["Air conditioning", "High roof", "Ample luggage"] },
    { name: "Toyota Coaster", slug: "toyota-coaster", brand: "Toyota", category: "van", seats: 30, luggage: 30, order: 23,
      description: "Dependable mini-coach for larger delegations. Air-conditioned throughout.",
      imageUrl: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
      features: ["Air conditioning", "PA system", "Reclining seats"] },

    // Buses
    { name: "Mercedes Premium", slug: "mercedes-bus-premium", brand: "Mercedes-Benz", category: "bus", seats: 20, luggage: 20, order: 30,
      description: "Executive mini-coach with lounge-style seating and conference layout.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
      features: ["Big sofa", "Conference layout", "Wi-Fi", "Entertainment system"] },
    { name: "Mercedes Standard", slug: "mercedes-bus-standard", brand: "Mercedes-Benz", category: "bus", seats: 30, luggage: 30, order: 31,
      description: "Comfortable, capable, refined. Group travel done properly.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
      features: ["Reclining seats", "Air conditioning", "PA system"] },
    { name: "Mercedes Deluxe", slug: "mercedes-bus-deluxe", brand: "Mercedes-Benz", category: "bus", seats: 30, luggage: 30, order: 32,
      description: "Premium appointments throughout. The top of the Mercedes coach range.",
      imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
      features: ["Premium leather", "Wi-Fi", "Entertainment system", "Refreshment bar"] },
  ];

  for (const v of fleetData) {
    await db.fleet.upsert({
      where: { slug: v.slug },
      update: {},
      create: {
        name: v.name,
        slug: v.slug,
        brand: v.brand,
        category: v.category,
        seats: v.seats,
        luggage: v.luggage,
        description: v.description,
        imageUrl: v.imageUrl,
        features: JSON.stringify(v.features),
        displayOrder: v.order,
        isVisible: true,
      },
    });
  }
  console.log(`  ✓ Fleet: ${fleetData.length} vehicles`);

  // ---------------- Reviews ----------------
  const reviewData = [
    { clientName: "Ali Abdallah", clientTitle: "Corporate Delegate", rating: 5, featured: true, body: "Thank you for the excellent hospitality and outstanding service provided by the team. Special thanks to Mr. Murtada and Mr. Basit for their support and warm reception from the airport until the end of the trip." },
    { clientName: "Rabbi Hasan", clientTitle: "Business Traveller", rating: 5, featured: true, body: "I had a great experience with this company. The driver was extremely professional, respectful, and made the entire journey comfortable and enjoyable. I truly appreciate the excellent service and would highly recommend others to use their services." },
    { clientName: "Emma Lou", clientTitle: "Returning Client", rating: 5, body: "I have used our wonderful trusted limo service many times since I have been in Saudi! So respectful and graceful — highly recommended without a doubt." },
    { clientName: "Tahani B", clientTitle: "Corporate Travel Manager", rating: 5, featured: true, body: "We used Amhar chauffeur service for a full-day, multi-day company booking, and the experience was excellent from start to finish. The drivers were professional, punctual, and courteous. Communication was smooth, the vehicles were clean and comfortable, and everything was handled efficiently. Highly recommend for corporate transportation." },
    { clientName: "Abdulaziz Alzouman", clientTitle: "VIP Client", rating: 5, body: "Absolutely outstanding chauffeur service. The company is professional, fast, and provides a truly high-end experience from start to finish. Their response time is excellent and everything is handled smoothly and efficiently. Highly recommended." },
    { clientName: "Mathi Venkat", clientTitle: "IHI Corporation", rating: 5, body: "We booked for a Riyadh trip and the service was very, very good. Our driver Basit Khan is a very nice guy. We are happy to say — the best." },
    { clientName: "Engr Abbas Khan", clientTitle: "Executive", rating: 5, body: "I appreciate the service provided by Amhar Chauffeur. It was prompt, clean, and respectful. Thank you to the Amhar Service team." },
    { clientName: "Mike Accardo", clientTitle: "Business Traveller", rating: 5, body: "Mujahid was my driver this week — my first time in Riyadh for business. He was fantastic and went out of his way to make my multi-day travel as smooth as possible. I will be requesting him by name the next time I am in Riyadh. Five stars and then some." },

    // Pending (unapproved)
    { clientName: "Sarah Mitchell", clientTitle: "Tourist", rating: 5, body: "Just used Amhar for a tour of Diriyah. Wonderful service and the Mercedes S-Class was immaculate. Our driver spoke excellent English." },
    { clientName: "Khalid Al-Saud", clientTitle: "VIP", rating: 5, body: "Outstanding service from booking to drop-off. The Rolls Royce was pristine and the chauffeur knew every back route. Will use again." },
  ];

  for (const [i, r] of reviewData.entries()) {
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
  console.log(`  ✓ Reviews: ${reviewData.length} (${reviewData.length - 2} approved, 2 pending)`);

  // ---------------- Sample leads ----------------
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

    // Activity log for created leads
    await db.activityLog.create({
      data: {
        userId: null,
        action: "lead.created",
        entityType: "lead",
        entityId: created.id,
        leadId: created.id,
        metadata: JSON.stringify({ reference: created.reference, fullName: created.fullName }),
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
      await db.activityLog.create({
        data: {
          userId: l.assigned,
          action: "lead.assigned",
          entityType: "lead",
          entityId: created.id,
          leadId: created.id,
          metadata: JSON.stringify({ reference: created.reference, to: l.assigned }),
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

  console.log("\n✓ Seed complete.");
  console.log("  Admin emails: mir@amharksa.com, basit@amharksa.com, murtada@amharksa.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
