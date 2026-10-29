"use client";

import { siteContent } from "@/data/siteContent";

interface EnquirySectionProps {
  onOpenEnquiry: (trigger: HTMLButtonElement) => void;
}

/**
 * Rooted Living enquiry close — calm invitation only.
 * Opens the existing EnquiryModal via explicit click/tap (no scroll or auto-open).
 * Contact details are omitted until verified; the modal owns the form and API.
 */
export default function EnquirySection({ onOpenEnquiry }: EnquirySectionProps) {
  const { enquiry } = siteContent;

  return (
    <section
      id="enquiry"
      className="relative bg-forest text-ivory-soft overflow-hidden"
      aria-labelledby="enquiry-heading"
    >
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url('/assets/images/home-bg-texture.png')`,
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
        }}
        aria-hidden="true"
      />

      {/* Soft sage wash — atmosphere only, no decorative clutter */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 max-w-xl bg-gradient-to-l from-sage/10 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="vanae-container vanae-section relative pb-24 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-end">
          <div className="lg:col-span-7 max-w-2xl">
            <p className="font-sans text-xs tracking-[0.28em] uppercase text-gold-pill font-semibold mb-4">
              {enquiry.eyebrow}
            </p>
            <h2
              id="enquiry-heading"
              className="font-serif text-fluid-2xl md:text-fluid-3xl text-ivory-soft font-normal leading-tight tracking-tight mb-5"
            >
              {enquiry.heading}
            </h2>
            <p className="font-sans text-base md:text-fluid-base leading-relaxed text-ivory-soft/80 max-w-xl mb-8">
              {enquiry.supportingCopy}
            </p>

            <button
              type="button"
              onClick={(event) => onOpenEnquiry(event.currentTarget)}
              aria-haspopup="dialog"
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3.5 rounded-full bg-gold hover:bg-ivory text-luxury-black font-sans font-semibold text-xs tracking-[0.22em] uppercase transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              {enquiry.ctaText}
            </button>
          </div>

          <div className="lg:col-span-5 lg:pb-2">
            <div
              className="h-px w-16 bg-gold/45 mb-5"
              aria-hidden="true"
            />
            <p className="font-sans text-xs tracking-[0.18em] uppercase text-ivory-soft/55 leading-relaxed max-w-xs">
              No phone, email, or WhatsApp listed here until details are confirmed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
