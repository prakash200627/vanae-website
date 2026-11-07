"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { revealAmenityItems } from "@/lib/motion";

interface ClubhouseSectionProps {
  onOpenClubhouse?: () => void;
}

/**
 * Clubhouse directory — visually distinct from outdoor amenities.
 * Indoor “Pool” is separate from outdoor “Swimming Pool”.
 */
export default function ClubhouseSection({
  onOpenClubhouse,
}: ClubhouseSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);
  const clubhouse = siteContent.clubhouse;
  const categories = clubhouse.categories;
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const panelId = `${listId}-panel`;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const amenityListRef = useRef<HTMLUListElement>(null);

  const active = categories[activeIndex] ?? categories[0];
  const showImage =
    active?.imageApproved === true && Boolean(active?.image);

  useEffect(() => {
    return revealAmenityItems(amenityListRef.current, activeIndex);
  }, [activeIndex]);

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
      <section id="clubhouse" className="bg-ink text-ivory">
        <div className="vanae-container vanae-section">
          <p className="font-sans text-ivory/70">
            Clubhouse directory pending approved content.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="clubhouse"
      className="relative bg-ink text-ivory overflow-hidden border-b border-white/10"
      aria-labelledby="clubhouse-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,90,70,0.28),transparent_55%)]"
        aria-hidden="true"
      />

      <div className="vanae-container vanae-section relative">
        <header className="max-w-3xl mb-8 md:mb-12">
          <p
            data-reveal="eyebrow"
            className="text-gold font-sans font-semibold text-xs tracking-[0.28em] uppercase mb-3"
          >
            Clubhouse
          </p>
          <h2
            data-reveal="heading"
            id="clubhouse-heading"
            className="font-serif text-fluid-2xl md:text-fluid-3xl text-ivory font-normal tracking-tight mb-3"
          >
            {clubhouse.heading}
            <span className="text-gold"> — {clubhouse.sizeLabel}</span>
          </h2>
          <p
            data-reveal="copy"
            className="font-sans text-ivory/75 text-fluid-base leading-relaxed max-w-2xl"
          >
            {clubhouse.supportingCopy}
          </p>
          <p
            data-reveal="copy"
            className="mt-4 font-sans text-xs uppercase tracking-[0.2em] text-ivory/45"
          >
            {clubhouse.approvalNote}
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-5">
            <ul
              className="list-none m-0 p-0 space-y-1"
              role="tablist"
              aria-label="Clubhouse categories"
              aria-orientation="vertical"
            >
              {categories.map((category, index) => {
                const selected = index === activeIndex;
                const buttonId = `${listId}-item-${index}`;
                return (
                  <li data-reveal="item" key={`${category.name}-${index}`}>
                    <button
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      id={buttonId}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls={panelId}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => selectIndex(index)}
                      onKeyDown={(event) => onIndexKeyDown(event, index)}
                      className={`w-full text-left flex items-baseline gap-4 sm:gap-5 px-3 sm:px-4 py-3.5 sm:py-4 rounded-none border transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                        selected
                          ? "bg-ivory text-ink border-ivory"
                          : "bg-transparent text-ivory border-transparent hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`font-sans text-xs tracking-[0.18em] tabular-nums shrink-0 ${
                          selected ? "text-forest" : "text-gold"
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
                            selected ? "text-stone" : "text-ivory/50"
                          }`}
                        >
                          {category.items.length}{" "}
                          {category.items.length === 1 ? "space" : "spaces"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={`${listId}-item-${activeIndex}`}
            className="lg:col-span-7"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <figure className="md:col-span-5 relative m-0">
                {showImage && active.image ? (
                  <>
                    <div
                      data-reveal="image"
                      className="relative aspect-[4/5] overflow-hidden rounded-none bg-forest-deep/80 border border-white/10"
                    >
                      <Image
                        src={active.image}
                        alt={active.imageAlt || active.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 32vw"
                        className="object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                    {active.imageCaption ? (
                      <figcaption className="mt-3 font-sans text-[11px] text-ivory/55 tracking-wide">
                        {active.imageCaption}
                      </figcaption>
                    ) : null}
                  </>
                ) : (
                  <div
                    data-reveal="image"
                    className="relative aspect-[4/5] overflow-hidden rounded-none bg-forest-deep/80 border border-white/10 flex flex-col items-center justify-center text-center px-6 sm:px-8"
                    role="img"
                    aria-label={`${active.name} — clubhouse photograph pending approval`}
                  >
                    <span className="font-sans text-[10px] uppercase tracking-[0.28em] text-gold mb-3">
                      Clubhouse
                    </span>
                    <span className="font-serif text-xl sm:text-2xl text-ivory tracking-tight max-w-[14rem]">
                      {active.name}
                    </span>
                    <span
                      className="mt-5 block h-px w-10 bg-gold/55"
                      aria-hidden="true"
                    />
                    <span className="mt-5 font-sans text-[10px] uppercase tracking-[0.2em] text-ivory/55">
                      Photograph pending
                    </span>
                  </div>
                )}
              </figure>

              <div className="md:col-span-7">
                <h3 className="font-serif text-fluid-xl text-ivory tracking-tight mb-6">
                  {active.name}
                </h3>

                <ul
                  ref={amenityListRef}
                  className="space-y-0 font-sans text-sm text-ivory/85 list-none m-0 p-0 columns-1 sm:columns-2 gap-x-8"
                >
                  {active.items.map((item, itemIndex) => (
                    <li
                      data-amenity-item
                      key={`${active.name}-${item}-${itemIndex}`}
                      className="break-inside-avoid flex gap-3 border-b border-white/10 py-2.5"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 rounded-full bg-gold shrink-0"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {onOpenClubhouse && (
                  <button
                    type="button"
                    onClick={onOpenClubhouse}
                    className="mt-8 inline-flex items-center justify-center min-h-[48px] px-7 py-3 rounded-full bg-gold hover:bg-ivory text-ink font-sans font-semibold text-xs tracking-[0.2em] uppercase transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    {clubhouse.bannerBtnText}
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
