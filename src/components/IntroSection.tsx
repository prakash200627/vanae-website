"use client";

import { useRef } from "react";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";
import { useSectionReveal } from "@/hooks/useSectionReveal";

/**
 * Overview — brochure-grounded copy with a clean architectural still.
 * Rectangular media only (no arched / ornamental masks).
 */
export default function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const { overview } = siteContent;
  const showPortrait = overview.portraitApproved === true;

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="relative bg-ivory text-charcoal overflow-hidden border-b border-ivory-border"
      aria-labelledby="overview-heading"
    >
      <div className="vanae-container vanae-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <p
              data-reveal="eyebrow"
              className="font-sans text-forest font-semibold text-xs tracking-[0.28em] uppercase mb-4"
            >
              {overview.eyebrow}
            </p>

            <h2
              data-reveal="heading"
              id="overview-heading"
              className="font-serif text-fluid-2xl md:text-fluid-3xl text-charcoal font-normal tracking-tight max-w-xl"
            >
              {overview.headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <div className="mt-6 space-y-4 font-sans text-fluid-base text-stone leading-relaxed max-w-xl">
              {overview.paragraphs.map((paragraph) => (
                <p data-reveal="copy" key={paragraph.slice(0, 48)}>
                  {paragraph}
                </p>
              ))}
            </div>

            {overview.projectDetails.length > 0 && (
              <ul
                data-reveal="copy"
                className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5"
              >
                {overview.projectDetails.map((detail) => (
                  <li key={detail.label} className="min-w-0">
                    <p className="font-serif text-xl sm:text-2xl text-ink tracking-tight">
                      {detail.value}
                    </p>
                    <p className="mt-1 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-stone">
                      {detail.label}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            <p
              data-reveal="copy"
              className="mt-8 font-sans text-sm text-charcoal/75 tracking-wide"
            >
              {overview.badge}
            </p>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <figure data-reveal="image" className="relative w-full">
              {showPortrait ? (
                <div className="relative aspect-[16/11] sm:aspect-[3/2] overflow-hidden rounded-none bg-sage/30">
                  <Image
                    src={overview.portraitImage}
                    alt={overview.portraitAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover object-center"
                    priority={false}
                  />
                </div>
              ) : (
                <div
                  className="relative aspect-[16/11] sm:aspect-[3/2] overflow-hidden rounded-none bg-sage border border-ivory-border flex flex-col items-center justify-center text-center px-8"
                  role="img"
                  aria-label="Overview image pending — rights confirmation required"
                >
                  <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-forest mb-3">
                    Imagery
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl text-ink tracking-tight">
                    Image pending
                  </span>
                </div>
              )}
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
