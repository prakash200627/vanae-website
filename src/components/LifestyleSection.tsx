"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { siteContent } from "@/data/siteContent";
import { useSectionReveal } from "@/hooks/useSectionReveal";

interface LifestyleSectionProps {
  onOpenEnquire?: () => void;
}

/**
 * Unified Lifestyle editorial — full-width intro, then selectable amenity row.
 * Detailed amenity directories remain in siteContent for chatbot / future use.
 * Keeps #amenities (nav), #lifestyle and #clubhouse aliases for deep links.
 */
export default function LifestyleSection({ onOpenEnquire }: LifestyleSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  const lifestyle = siteContent.lifestyle;
  const highlights = lifestyle.highlights;
  const listId = useId();
  /** Default: Event room (index 1) — matches design reference. */
  const [activeIndex, setActiveIndex] = useState(1);
  const selected = highlights[activeIndex] ?? highlights[1] ?? highlights[0];

  const selectIndex = (index: number) => {
    if (index < 0 || index >= highlights.length) return;
    setActiveIndex(index);
  };

  const onListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (highlights.length === 0) return;
    let next = activeIndex;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      next = (activeIndex + 1) % highlights.length;
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      next = (activeIndex - 1 + highlights.length) % highlights.length;
    } else if (event.key === "Home") {
      event.preventDefault();
      next = 0;
    } else if (event.key === "End") {
      event.preventDefault();
      next = highlights.length - 1;
    } else {
      return;
    }
    setActiveIndex(next);
    const btn = event.currentTarget.querySelector<HTMLButtonElement>(
      `[data-lifestyle-option="${next}"]`
    );
    btn?.focus();
  };

  const headingLines = lifestyle.headingLines?.length
    ? lifestyle.headingLines
    : [lifestyle.heading];

  return (
    <section
      ref={sectionRef}
      id="amenities"
      className="relative bg-ivory text-charcoal overflow-hidden border-b border-ivory-border"
      aria-labelledby="lifestyle-heading"
    >
      {/* Deep-link aliases — do not remove; nav / legacy anchors rely on them */}
      <span id="lifestyle" className="absolute top-0 left-0 h-0 w-0" aria-hidden="true" />
      <span id="clubhouse" className="absolute top-0 left-0 h-0 w-0" aria-hidden="true" />

      <div className="vanae-container vanae-section">
        {/* TOP — full section width intro */}
        <header className="mb-8 md:mb-10 lg:mb-12 max-w-3xl">
          <p
            data-reveal="eyebrow"
            className="text-forest font-sans font-semibold text-xs tracking-[0.28em] uppercase mb-3"
          >
            {lifestyle.eyebrow}
          </p>
          <h2
            data-reveal="heading"
            id="lifestyle-heading"
            className="font-serif text-fluid-2xl md:text-fluid-3xl text-charcoal font-normal tracking-tight mb-4 max-w-xl leading-[1.08]"
          >
            {headingLines.map((line, index) => (
              <span key={line} className="block">
                {line}
                {index < headingLines.length - 1 ? " " : null}
              </span>
            ))}
          </h2>
          <p
            data-reveal="copy"
            className="font-sans text-stone text-fluid-base leading-relaxed max-w-xl mb-3"
          >
            {lifestyle.intro}
          </p>
          {lifestyle.note ? (
            <p
              data-reveal="copy"
              className="font-sans text-stone/80 text-[11px] sm:text-xs tracking-[0.18em] uppercase leading-relaxed max-w-xl"
            >
              {lifestyle.note}
            </p>
          ) : null}
        </header>

        {/* BELOW — content row: compact list | image | details + CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
          <div className="lg:col-span-3 flex flex-col min-w-0">
            <ul
              id={listId}
              role="listbox"
              aria-label="Lifestyle spaces"
              aria-activedescendant={
                selected ? `lifestyle-option-${activeIndex}` : undefined
              }
              onKeyDown={onListKeyDown}
              className="m-0 p-0 list-none flex flex-col gap-1"
            >
              {highlights.map((item, index) => {
                const isActive = index === activeIndex;
                const number = String(index + 1).padStart(2, "0");
                return (
                  <li key={item.title} role="none">
                    <button
                      id={`lifestyle-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      data-lifestyle-option={index}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => selectIndex(index)}
                      className={`w-full text-left flex items-baseline gap-3 sm:gap-4 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl border transition-colors duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory ${isActive
                          ? "bg-forest text-ivory border-forest"
                          : "bg-transparent text-gold border-transparent hover:bg-sage/50"
                        }`}
                    >
                      <span
                        className={`font-sans text-xs tracking-[0.18em] tabular-nums shrink-0 ${isActive ? "text-ivory" : "text-gold"
                          }`}
                        aria-hidden="true"
                      >
                        {number}
                      </span>
                      <span
                        className={`min-w-0 block font-serif text-base sm:text-lg tracking-tight ${
                          isActive ? "text-ivory" : "text-black"
                        }`}
                      >
                        {item.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div
            className="lg:col-span-5 min-w-0 flex items-start"
            data-reveal="image"
          >
            {selected ? (
              <figure className="relative m-0 mx-auto lg:mx-0 overflow-hidden bg-sage/30 aspect-[3/4] h-[20rem] sm:h-[22rem] lg:h-[24rem] w-auto max-w-full">
                <Image
                  key={selected.image}
                  src={selected.image}
                  alt={selected.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 70vw, 18rem"
                  className="object-cover object-center transition-opacity duration-500 ease-out motion-reduce:transition-none"
                  loading="lazy"
                />
              </figure>
            ) : null}
          </div>

          <div
            className="lg:col-span-4 flex flex-col min-w-0"
            data-reveal="copy"
            aria-live="polite"
          >
            {selected ? (
              <div
                key={selected.title}
                className="flex flex-col transition-opacity duration-300 ease-out motion-reduce:transition-none"
              >
                <h3 className="font-serif text-fluid-xl md:text-fluid-2xl text-charcoal tracking-tight mb-3 sm:mb-4">
                  {selected.title}
                </h3>
                <p className="font-sans text-stone text-sm sm:text-base leading-relaxed mb-4 max-w-md">
                  {selected.description}
                </p>
                {selected.bullets?.length ? (
                  <ul className="m-0 mb-5 p-0 list-none flex flex-col gap-2.5 max-w-md">
                    {selected.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 font-sans text-sm text-charcoal/80 leading-relaxed"
                      >
                        <span
                          className="mt-2 h-1.5 w-1.5 rounded-full bg-forest shrink-0"
                          aria-hidden="true"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="border-t border-ivory-border pt-5 sm:pt-6">
                  {onOpenEnquire ? (
                    <button
                      type="button"
                      onClick={onOpenEnquire}
                      className="inline-flex items-center justify-center self-start min-h-[48px] px-7 py-3 rounded-full bg-forest hover:bg-forest-deep text-ivory font-sans font-semibold text-xs tracking-[0.2em] uppercase transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                    >
                      {lifestyle.ctaText}
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
