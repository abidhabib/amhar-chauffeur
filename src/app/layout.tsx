import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AMHAR — Luxury Chauffeur & Limousine Service, Riyadh",
  description:
    "Premium chauffeur-driven transportation for airport transfers, corporate travel, VIPs, and bespoke journeys across Saudi Arabia and the Middle East. Quote-based. Discreet. Punctual.",
  keywords: [
    "Riyadh chauffeur service",
    "luxury limousine Riyadh",
    "airport transfer Saudi Arabia",
    "VIP chauffeur KSA",
    "corporate transportation Riyadh",
    "Amhar limo",
  ],
  authors: [{ name: "AMHAR Premier Chauffeur Service" }],
  openGraph: {
    title: "AMHAR — Luxury Chauffeur & Limousine Service, Riyadh",
    description:
      "Premium chauffeur-driven transportation for airport transfers, corporate travel, and bespoke journeys across Saudi Arabia.",
    siteName: "AMHAR",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AMHAR — Luxury Chauffeur & Limousine Service, Riyadh",
    description:
      "Premium chauffeur-driven transportation for airport transfers, corporate travel, and bespoke journeys across Saudi Arabia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground min-h-screen`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
