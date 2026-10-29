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
 * Metadata avoids unverified tower/floor/clubhouse/amenity counts.
 * Canonical host remains provisional until the production domain is confirmed.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "VANAE | The Art of Rooted Living | Kollur, Hyderabad",
    template: "%s | VANAE",
  },
  description:
    "VANAE is a luxury residential address envisioned in Kollur, near ORR Exit 2, Hyderabad — where architecture and landscape are shaped as one story of rooted living.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "VANAE",
    locale: "en_IN",
    title: "VANAE | The Art of Rooted Living | Kollur, Hyderabad",
    description:
      "Rooted living in Kollur, near ORR Exit 2, Hyderabad. Architecture and landscape, one story.",
    images: [
      {
        url: "/assets/images/hero-poster.jpg",
        width: 1920,
        height: 1080,
        alt: "VANAE — Kollur, Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VANAE | The Art of Rooted Living | Kollur, Hyderabad",
    description:
      "Rooted living in Kollur, near ORR Exit 2, Hyderabad. Architecture and landscape, one story.",
    images: ["/assets/images/hero-poster.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/assets/logo.svg", type: "image/svg+xml" }],
    shortcut: "/assets/logo.svg",
    apple: "/assets/vanae-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body className="antialiased bg-ink text-ivory font-sans selection:bg-gold selection:text-ink">
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
