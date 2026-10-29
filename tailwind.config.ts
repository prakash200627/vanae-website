import type { Config } from "tailwindcss";

/**
 * Vanae Rooted Living tokens — keep in sync with src/app/globals.css.
 *
 * Core palette (approved):
 * - Forest #0D5A46 — structural brand
 * - Gold #C39663 — accent / numerals / one primary CTA (never body on ivory)
 * - Ink #0A1A15 — dark surfaces (forest-black)
 * - Ivory #F4EFE6 — warm reading surfaces
 * - Sage #DDE5DC — quiet secondary panels
 *
 * Contrast notes (approximate WCAG relative luminance):
 * - Forest on ivory → AA pass for large/normal depending on weight
 * - Ivory on forest / ink → AA pass
 * - Gold on ivory → FAIL for body text (accent only)
 * - Gold on ink → AA for large / accent
 * - White on gold → FAIL for text
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#0D5A46",
          deep: "#093F31",
          /** Alias → ink (Rooted Living forest-black) */
          nearBlack: "#0A1A15",
        },
        ink: {
          DEFAULT: "#0A1A15",
        },
        gold: {
          light: "#d8ad7a",
          DEFAULT: "#C39663",
          dark: "#a57947",
          deep: "#8d6438",
          /** Compact-pill CTA tone (existing UI compatibility) */
          pill: "#C6A568",
        },
        ivory: {
          DEFAULT: "#F4EFE6",
          soft: "#F7F3EB",
          border: "#E4DDD2",
        },
        sage: {
          DEFAULT: "#DDE5DC",
          muted: "#C8D4C7",
        },
        stone: {
          DEFAULT: "#736B63",
          muted: "#8A827A",
        },
        charcoal: {
          DEFAULT: "#232323",
        },
        luxury: {
          black: "#0A1A15",
          dark: "#0A1A15",
          charcoal: "#181719",
          card: "#202022",
          navy: "#152833",
          cream: "#F4EFE6",
          lightGray: "#f7f7f7",
          border: "rgba(255, 255, 255, 0.1)",
          goldBorder: "rgba(195, 150, 99, 0.35)",
        },
      },
      fontFamily: {
        /** Display — Cormorant Garamond via next/font (--font-display) */
        serif: [
          "var(--font-display)",
          "Cormorant Garamond",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        display: [
          "var(--font-display)",
          "Cormorant Garamond",
          "Georgia",
          "Times New Roman",
          "serif",
        ],
        /** Body / UI — Hanken Grotesk via next/font (--font-body) */
        sans: [
          "var(--font-body)",
          "Hanken Grotesk",
          "system-ui",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        /** Fluid editorial scale (clamp) — use with font-serif / font-display */
        "fluid-xs": ["clamp(0.75rem, 0.7rem + 0.2vw, 0.8125rem)", { lineHeight: "1.5" }],
        "fluid-sm": ["clamp(0.875rem, 0.82rem + 0.25vw, 0.9375rem)", { lineHeight: "1.55" }],
        "fluid-base": ["clamp(1rem, 0.95rem + 0.3vw, 1.125rem)", { lineHeight: "1.65" }],
        "fluid-lg": ["clamp(1.125rem, 1rem + 0.55vw, 1.375rem)", { lineHeight: "1.5" }],
        "fluid-xl": ["clamp(1.375rem, 1.15rem + 1vw, 1.75rem)", { lineHeight: "1.35" }],
        "fluid-2xl": ["clamp(1.75rem, 1.35rem + 1.6vw, 2.5rem)", { lineHeight: "1.2" }],
        "fluid-3xl": ["clamp(2.25rem, 1.6rem + 2.4vw, 3.5rem)", { lineHeight: "1.12" }],
        "fluid-4xl": ["clamp(2.75rem, 1.9rem + 3.2vw, 4.5rem)", { lineHeight: "1.08" }],
      },
      maxWidth: {
        content: "1280px",
      },
      spacing: {
        gutter: "1.5rem",
        "gutter-lg": "3rem",
        "section-y": "6rem",
        "section-y-lg": "9rem",
      },
      transitionTimingFunction: {
        morph: "cubic-bezier(0.22, 1, 0.36, 1)",
        reveal: "cubic-bezier(0.16, 1, 0.3, 1)",
        rooted: "cubic-bezier(0.33, 1, 0.68, 1)",
      },
      transitionDuration: {
        morph: "500ms",
        reveal: "700ms",
        rooted: "600ms",
      },
      boxShadow: {
        luxury: "0 20px 50px rgba(10, 26, 21, 0.35)",
        glow: "0 0 35px rgba(195, 150, 99, 0.25)",
        pill: "0 10px 40px rgba(10, 26, 21, 0.16)",
      },
      borderRadius: {
        arch: "50% / 18%",
      },
    },
  },
  plugins: [],
};
export default config;
