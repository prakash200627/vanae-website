"use client";

import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";
import { useSectionReveal } from "@/hooks/useSectionReveal";

/** VANAE location information and the approved Google Maps destination. */
export default function LocationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const location = siteContent.location;

  return (
    <section
      ref={sectionRef}
      id="location"
      className="relative overflow-hidden bg-ivory text-charcoal"
      aria-labelledby="location-heading"
    >
      <div className="vanae-container vanae-section">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-6 lg:col-span-5">
            <p
              data-reveal="eyebrow"
              className="font-sans text-xs font-semibold uppercase tracking-[0.28em] text-forest"
            >
              {location.tag}
            </p>
            <h2
              data-reveal="heading"
              id="location-heading"
              className="font-serif text-fluid-3xl font-normal leading-[1.08] tracking-tight text-charcoal md:text-fluid-4xl"
            >
              {location.headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <p
              data-reveal="copy"
              className="max-w-lg font-sans text-base leading-[1.8] text-charcoal/80 sm:text-lg"
            >
              {location.copy}
            </p>

            <div
              data-reveal="copy"
              className="max-w-lg border-t border-ivory-border pt-5"
            >
              <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-forest">
                Project address
              </p>
              <address className="not-italic font-sans text-sm leading-[1.75] text-charcoal/80 sm:text-base">
                {location.siteAddress}
              </address>
            </div>
          </div>

          <div
            data-reveal="image"
            className="relative aspect-[4/3] overflow-hidden border border-ivory-border bg-forest shadow-[0_24px_54px_rgba(10,26,21,0.16)] sm:aspect-[3/2] lg:col-span-7"
          >
            <Image
              src={location.mapImage}
              alt={location.mapImageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover object-center"
            />
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent px-5 pb-5 pt-16 sm:flex-row sm:items-end sm:justify-between sm:px-7 sm:pb-7"
            >
              <p className="font-serif text-lg leading-tight text-ivory sm:text-xl">
                {location.publicPlace}
              </p>
              <a
                href={location.openMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open VANAE directions in Google Maps"
                className="relative inline-flex min-h-[48px] w-fit shrink-0 items-center justify-center gap-2 rounded-full border border-gold bg-gold px-6 py-3 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-ink transition-colors hover:border-ivory hover:bg-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-forest motion-reduce:transition-none"
              >
                Open directions
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
