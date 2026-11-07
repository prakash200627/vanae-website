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
    default: "VANAE | The Art of Rooted Living | Kollur, Hyderabad",
    template: "%s | VANAE",
  },
  description:
    "VANAE — The Art of Rooted Living. 3 & 4 BHK residences across six towers at Kollur, by ORR Exit 2, Hyderabad — where architecture and landscape form one story.",
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
      "The Art of Rooted Living in Kollur, by ORR Exit 2, Hyderabad — architecture and landscape as one story.",
    images: [
      {
        url: "/assets/renders/address-twin-towers-dusk-p9.jpg",
        width: 2400,
        height: 1544,
        alt: "VANAE — The Art of Rooted Living, Kollur, Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VANAE | The Art of Rooted Living | Kollur, Hyderabad",
    description:
      "The Art of Rooted Living in Kollur, by ORR Exit 2, Hyderabad — architecture and landscape as one story.",
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
