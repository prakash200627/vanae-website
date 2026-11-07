"use client";

import { useRef } from "react";
import { siteContent } from "@/data/siteContent";
import { useSectionReveal } from "@/hooks/useSectionReveal";

interface EnquirySectionProps {
  onOpenEnquiry: (trigger: HTMLButtonElement) => void;
}

/**
 * Rooted Living enquiry close — calm invitation only.
 */
export default function EnquirySection({ onOpenEnquiry }: EnquirySectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const { enquiry } = siteContent;

  return (
    <section
      ref={sectionRef}
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

      <div
        className="absolute inset-y-0 right-0 w-1/2 max-w-xl bg-gradient-to-l from-sage/10 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="vanae-container vanae-section relative pb-24 sm:pb-20">
        <div className="max-w-2xl">
          <p
            data-reveal="eyebrow"
            className="font-sans text-xs tracking-[0.28em] uppercase text-gold-pill font-semibold mb-4"
          >
            {enquiry.eyebrow}
          </p>
          <h2
            data-reveal="heading"
            id="enquiry-heading"
            className="font-serif text-fluid-2xl md:text-fluid-3xl text-ivory-soft font-normal leading-tight tracking-tight mb-5"
          >
            {enquiry.heading}
          </h2>
          <p
            data-reveal="copy"
            className="font-sans text-base md:text-fluid-base leading-relaxed text-ivory-soft/80 max-w-xl mb-8"
          >
            {enquiry.supportingCopy}
          </p>

          <button
            data-reveal="item"
            type="button"
            onClick={(event) => onOpenEnquiry(event.currentTarget)}
            aria-haspopup="dialog"
            className="inline-flex items-center justify-center min-h-[48px] px-8 py-3.5 rounded-full bg-gold hover:bg-ivory text-luxury-black font-sans font-semibold text-xs tracking-[0.22em] uppercase transition-colors duration-300 motion-reduce:transition-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
          >
            {enquiry.ctaText}
          </button>
        </div>
      </div>
    </section>
  );
}
