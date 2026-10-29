"use client";

import { ExternalLink } from "lucide-react";
import { siteContent } from "@/data/siteContent";

/**
 * Rooted Living location — client-verified Google Maps embed only.
 * No invented street addresses, distances, landmarks, or travel times.
 */
export default function LocationSection() {
  const location = siteContent.location;
  const showMap =
    location.mapApproved === true && Boolean(location.embedMapUrl);
  const openMapsUrl = location.openMapsUrl?.trim() || "";

  return (
    <section
      id="location"
      className="relative bg-ivory text-charcoal overflow-hidden"
      aria-labelledby="location-heading"
    >
      <div className="vanae-container vanae-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5 space-y-5">
            <p className="text-forest font-sans font-semibold text-xs tracking-[0.28em] uppercase">
              {location.tag}
            </p>
            <h2
              id="location-heading"
              className="font-serif text-fluid-2xl md:text-fluid-3xl text-charcoal font-normal tracking-tight"
            >
              {location.headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <p className="font-sans text-stone text-fluid-base leading-relaxed max-w-md">
              {location.copy}
            </p>

            <div className="border-t border-ivory-border pt-5 space-y-3 max-w-md">
              <p className="font-serif text-xl text-forest tracking-tight">
                {location.publicPlace}
              </p>
              <p className="font-sans text-xs text-stone/80 leading-relaxed uppercase tracking-[0.14em]">
                {location.approvalNote}
              </p>
            </div>
          </div>

          <div className="lg:col-span-7">
            {showMap ? (
              <div className="space-y-3">
                <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-sage/40 border border-ivory-border">
                  <iframe
                    title="Interactive map of Vanae Project on Google Maps"
                    src={location.embedMapUrl}
                    className="absolute inset-0 h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                    allow="fullscreen"
                  />
                </div>
                {openMapsUrl ? (
                  <p>
                    <a
                      href={openMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 min-h-[44px] font-sans text-xs tracking-[0.18em] uppercase text-forest hover:text-gold border-b border-forest/30 hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory rounded-sm transition-colors"
                    >
                      Open in Google Maps
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                    </a>
                  </p>
                ) : null}
              </div>
            ) : (
              <div
                className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden bg-sage/50 border border-ivory-border flex flex-col items-center justify-center px-8 text-center"
                role="img"
                aria-label="Map pending confirmation."
              >
                <p className="font-serif text-fluid-lg text-forest tracking-tight mb-3">
                  Map pending confirmation
                </p>
                <p className="font-sans text-xs uppercase tracking-[0.2em] text-stone">
                  Location details TO CONFIRM
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
