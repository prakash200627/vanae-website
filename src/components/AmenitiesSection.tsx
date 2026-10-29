"use client";

import { useCallback, useId, useRef, useState } from "react";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";

interface AmenitiesSectionProps {
  onOpenAmenities?: () => void;
}

/**
 * Rooted Living amenities — numbered index + one rectangular media panel.
 * Image-led index: only categories with imageApproved && src show media.
 * Labels describe the frame; official amenity directory remains TO CONFIRM.
 */
export default function AmenitiesSection({ onOpenAmenities }: AmenitiesSectionProps) {
  const amenities = siteContent.clubhouseAmenities;
  const categories = amenities.categories;
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const panelId = `${listId}-panel`;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const active = categories[activeIndex] ?? categories[0];

  const selectIndex = useCallback(
    (index: number, options?: { moveFocus?: boolean }) => {
      if (!categories.length) return;
      const next = Math.max(0, Math.min(categories.length - 1, index));
      setActiveIndex(next);
      if (options?.moveFocus) {
        buttonRefs.current[next]?.focus();
      }
    },
    [categories.length]
  );

  const onIndexKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const last = categories.length - 1;
    let next: number | null = null;

    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        next = index === last ? 0 : index + 1;
        break;
      case "ArrowUp":
      case "ArrowLeft":
        next = index === 0 ? last : index - 1;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    selectIndex(next, { moveFocus: true });
  };

  if (!categories.length) {
    return (
      <section id="amenities" className="bg-ivory text-charcoal">
        <div className="vanae-container vanae-section">
          <p className="font-sans text-stone">
            Amenities directory pending approved content.
          </p>
        </div>
      </section>
    );
  }

  const showImage = active?.imageApproved === true && Boolean(active.image);

  return (
    <section
      id="amenities"
      className="relative bg-ivory text-charcoal overflow-hidden"
      aria-labelledby="amenities-heading"
    >
      <div className="vanae-container vanae-section">
        <header className="max-w-2xl mb-8 md:mb-10">
          <p className="text-forest font-sans font-semibold text-xs tracking-[0.28em] uppercase mb-3">
            Lifestyle
          </p>
          <h2
            id="amenities-heading"
            className="font-serif text-fluid-2xl md:text-fluid-3xl text-charcoal font-normal tracking-tight mb-4"
          >
            {amenities.headingLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="font-sans text-stone text-fluid-base leading-relaxed">
            {amenities.supportingCopy}
          </p>
          <p className="mt-4 font-sans text-xs uppercase tracking-[0.2em] text-stone/80">
            {amenities.approvalNote}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Numbered index — vertical list; no horizontal card strip */}
          <div className="lg:col-span-5">
            <ul
              className="list-none m-0 p-0 space-y-1"
              aria-label="Amenity collections"
            >
              {categories.map((category, index) => {
                const selected = index === activeIndex;
                const buttonId = `${listId}-item-${index}`;
                return (
                  <li key={`${category.name}-${index}`}>
                    <button
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      id={buttonId}
                      type="button"
                      aria-pressed={selected}
                      aria-controls={panelId}
                      onClick={() => selectIndex(index)}
                      onKeyDown={(event) => onIndexKeyDown(event, index)}
                      className={`w-full text-left flex items-baseline gap-4 sm:gap-5 px-3 sm:px-4 py-3.5 sm:py-4 rounded-xl border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${
                        selected
                          ? "bg-forest text-ivory border-forest"
                          : "bg-transparent text-charcoal border-transparent hover:bg-sage/60"
                      }`}
                    >
                      <span
                        className={`font-sans text-xs tracking-[0.18em] tabular-nums shrink-0 ${
                          selected ? "text-gold" : "text-gold/80"
                        }`}
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-serif text-lg sm:text-xl tracking-tight">
                          {category.name}
                        </span>
                        <span
                          className={`mt-1 block font-sans text-[11px] uppercase tracking-[0.18em] ${
                            selected ? "text-ivory/65" : "text-stone"
                          }`}
                        >
                          {category.status}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Active detail + rectangular media */}
          <div
            id={panelId}
            className="lg:col-span-7"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <figure className="md:col-span-6 relative">
                {showImage ? (
                  <div className="relative aspect-[4/5] overflow-hidden rounded-none bg-sage/40">
                    <Image
                      src={active.image}
                      alt={active.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      className="object-cover object-center"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-none bg-sage border border-ivory-border flex flex-col items-center justify-center text-center px-8"
                    role="img"
                    aria-label={
                      active.imageAlt ||
                      "Amenity image pending — media rights TO CONFIRM"
                    }
                  >
                    <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-forest mb-3">
                      Imagery
                    </span>
                    <span className="font-serif text-2xl sm:text-3xl text-ink tracking-tight">
                      Image pending
                    </span>
                    <span className="mt-4 font-sans text-xs text-stone leading-relaxed max-w-[14rem]">
                      Media rights TO CONFIRM
                    </span>
                  </div>
                )}
                {!showImage && (
                  <figcaption className="mt-3 font-sans text-[11px] text-stone/80 tracking-wide">
                    Media rights TO CONFIRM
                  </figcaption>
                )}
              </figure>

              <div className="md:col-span-6">
                <h3 className="font-serif text-fluid-xl text-charcoal tracking-tight mb-3">
                  {active.name}
                </h3>
                <p className="font-sans text-sm text-stone leading-relaxed mb-6">
                  {active.description}
                </p>

                <ul className="space-y-3 font-sans text-sm text-charcoal/85 list-none m-0 p-0">
                  {active.items.map((item, itemIndex) => (
                    <li
                      key={`${item}-${itemIndex}`}
                      className="flex gap-3 border-b border-ivory-border pb-3 last:border-0"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 rounded-full bg-forest shrink-0"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {onOpenAmenities && (
                  <button
                    type="button"
                    onClick={onOpenAmenities}
                    className="mt-8 inline-flex items-center justify-center min-h-[48px] px-7 py-3 rounded-full bg-forest hover:bg-forest-deep text-ivory font-sans font-semibold text-xs tracking-[0.2em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                  >
                    Enquire about amenities
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
