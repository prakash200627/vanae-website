import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import { SITE_ORIGIN } from "@/lib/siteUrl";

/**
 * Rooted Living typography (Phase 1):
 * - Cormorant Garamond — display / editorial headings
 * - Hanken Grotesk — body, nav, controls, labels
 * Loaded via next/font (no CSS @import) with swap for readable first paint.
 */
const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const bodyFont = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Metadata uses brochure-verified project facts.
 * Canonical host remains provisional until the production domain is confirmed.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "VANAE",
    template: "%s | VANAE Kollur",
  },
  description:
    "Explore VANAE: Premium 3 & 4 BHK gated community high-rise apartments in Kollur near Outer Ring Road Exit 2, Hyderabad. Luxury architecture, clubhouse, and rooted living.",
  keywords: [
    "new residential projects in Kollur",
    "upcoming gated community projects Kollur",
    "premium apartments for sale in Kollur",
    "apartments near Outer Ring Road Kollur",
    "residential properties near Kollur ORR",
    "Kollur Hyderabad real estate projects",
    "luxury high-rise apartments Kollur",
    "3 BHK gated community apartments Kollur",
    "premium 3 BHK flats Kollur price",
    "top gated communities in Kollur Hyderabad",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "VANAE",
    locale: "en_IN",
    title: "VANAE | Luxury 3 & 4 BHK Apartments in Kollur, Hyderabad",
    description:
      "Premium 3 & 4 BHK gated community high-rise residences at Kollur, ORR Exit 2, Hyderabad — architecture and landscape as one story.",
    images: [
      {
        url: "/assets/renders/address-twin-towers-dusk-p9.jpg",
        width: 2400,
        height: 1544,
        alt: "VANAE — Luxury 3 & 4 BHK Apartments in Kollur, Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VANAE | Luxury 3 & 4 BHK Apartments in Kollur, Hyderabad",
    description:
      "Premium 3 & 4 BHK gated community residences at Kollur, ORR Exit 2, Hyderabad.",
    images: ["/assets/renders/address-twin-towers-dusk-p9.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/assets/icons/vanae-logo.jpg", type: "image/jpeg" }],
    shortcut: "/assets/icons/vanae-logo.jpg",
    apple: "/assets/icons/vanae-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: "VANAE",
    url: SITE_ORIGIN,
    description:
      "Premium 3 & 4 BHK residences located at Kollur Exit 2, Nehru Outer Ring Road, Hyderabad.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kollur Exit 2, Nehru Outer Ring Road, Nagulapalli, Edulnagulapally",
      addressLocality: "Kollur, Hyderabad",
      addressRegion: "Telangana",
      postalCode: "502300",
      addressCountry: "IN",
    },
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "The Clubhouse" },
      { "@type": "LocationFeatureSpecification", name: "Curated Outdoor Amenities" },
      { "@type": "LocationFeatureSpecification", name: "Biophilic Landscape" },
      { "@type": "LocationFeatureSpecification", name: "Swimming Pool" },
      { "@type": "LocationFeatureSpecification", name: "Super Gym & Fitness Studio" },
    ],
  };

  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-ink text-ivory font-sans selection:bg-gold selection:text-ink">
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
