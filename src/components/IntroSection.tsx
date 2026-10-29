"use client";

import Image from "next/image";
import { siteContent } from "@/data/siteContent";

interface IntroSectionProps {
  onOpenBrochure: () => void;
}

/**
 * Rooted Living Overview — editorial statement + rectangular media.
 * Project figures stay in siteContent as TO CONFIRM and are omitted here
 * until the client confirms them (avoids a “confirmed” facts strip).
 * Portrait renders when portraitApproved && portraitImage are set.
 */
export default function IntroSection({ onOpenBrochure }: IntroSectionProps) {
  const { overview } = siteContent;
  const showPortrait = overview.portraitApproved === true;

  return (
    <section
      id="overview"
      className="relative bg-ivory text-charcoal overflow-hidden border-b border-ivory-border"
      aria-labelledby="overview-heading"
    >
      <div className="vanae-container vanae-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Copy first in DOM for logical reading order when stacked */}
          <div className="lg:col-span-6 order-2 lg:order-1 lg:pr-2 xl:pr-6">
            <p className="font-sans text-forest font-semibold text-xs tracking-[0.28em] uppercase mb-4">
              {overview.eyebrow}
            </p>

            <h2
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
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <p className="mt-6 font-sans text-sm text-charcoal/75 tracking-wide">
              {overview.badge}
            </p>

            <button
              type="button"
              onClick={onOpenBrochure}
              className="mt-7 inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full bg-forest hover:bg-forest-deep text-ivory font-sans font-semibold text-xs tracking-[0.2em] uppercase transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              {overview.brochureBtnText}
            </button>
          </div>

          {/* Tall rectangular frame — image only when rights are confirmed */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center lg:justify-end">
            <figure className="relative w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-[28rem]">
              {showPortrait ? (
                <div className="relative aspect-[3/4] overflow-hidden rounded-none bg-sage/40">
                  <Image
                    src={overview.portraitImage}
                    alt={overview.portraitAlt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 448px"
                    className="object-cover object-center"
                    priority={false}
                  />
                </div>
              ) : (
                <div
                  className="relative aspect-[3/4] overflow-hidden rounded-none bg-sage border border-ivory-border flex flex-col items-center justify-center text-center px-8"
                  role="img"
                  aria-label="Overview image pending — rights confirmation required"
                >
                  <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-forest mb-3">
                    Imagery
                  </span>
                  <span className="font-serif text-2xl sm:text-3xl text-ink tracking-tight">
                    Image pending
                  </span>
                  <span className="mt-4 font-sans text-xs text-stone leading-relaxed max-w-[14rem]">
                    Architectural still awaiting rights confirmation. Layout reserved.
                  </span>
                </div>
              )}
              {!showPortrait && (
                <figcaption className="mt-4 font-sans text-[11px] text-stone/80 tracking-wide text-center lg:text-left">
                  Media rights TO CONFIRM
                </figcaption>
              )}
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
