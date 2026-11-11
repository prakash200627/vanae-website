"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { useSectionReveal } from "@/hooks/useSectionReveal";
import { prefersReducedMotion } from "@/lib/motion";

export type FloorPlanLightboxItem = {
  src: string;
  title: string;
  category?: string;
};

interface FloorPlansSectionProps {
  onOpenPlans?: () => void;
  onOpenLightbox?: (
    items: FloorPlanLightboxItem[],
    index: number,
    trigger: HTMLElement | null
  ) => void;
}

type CarouselCard = {
  src: string;
  title: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
  category: string;
};

/**
 * Unified master + unit floor-plan carousel.
 * object-contain only — never crop drawings. Opens existing LightboxModal.
 */
export default function FloorPlansSection({
  onOpenPlans,
  onOpenLightbox,
}: FloorPlansSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  useSectionReveal(sectionRef);
  const content = siteContent.floorPlans;
  const { masterPlan } = content;

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const unitPlans = useMemo(
    () =>
      content.plans.filter(
        (plan) => plan.drawingApproved === true && Boolean(plan.src)
      ),
    [content.plans]
  );

  const cards: CarouselCard[] = useMemo(
    () => [
      {
        src: masterPlan.src,
        title: masterPlan.title,
        caption: "Site layout · architectural drawing",
        alt: masterPlan.alt,
        width: masterPlan.width,
        height: masterPlan.height,
        category: "Master plan",
      },
      ...unitPlans.map((plan) => ({
        src: plan.src,
        title: plan.caption,
        caption: plan.caption,
        alt: plan.alt,
        width: plan.width,
        height: plan.height,
        category: "Floor plans",
      })),
    ],
    [masterPlan, unitPlans]
  );

  const lightboxItems: FloorPlanLightboxItem[] = useMemo(
    () =>
      cards.map((card) => ({
        src: card.src,
        title: card.title,
        category: card.category,
      })),
    [cards]
  );

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, cards.length]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-plan-card]");
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({
      left: direction * amount,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  const openAt = (src: string, trigger: HTMLElement | null) => {
    const index = lightboxItems.findIndex((item) => item.src === src);
    if (index < 0) return;
    onOpenLightbox?.(lightboxItems, index, trigger);
  };

  const onScrollerKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollByCard(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollByCard(-1);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="floor-plans"
      className="relative bg-ivory-soft text-charcoal overflow-x-hidden border-y border-ivory-border"
      aria-labelledby="floor-plans-heading"
    >
      <div className="vanae-container vanae-section space-y-10 md:space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end">
          <div className="lg:col-span-7 space-y-5">
            <p
              data-reveal="eyebrow"
              className="text-forest font-sans font-semibold text-xs tracking-[0.28em] uppercase"
            >
              Floor plans
            </p>
            <h2
              data-reveal="heading"
              id="floor-plans-heading"
              className="font-serif text-fluid-2xl md:text-fluid-3xl text-charcoal font-normal tracking-tight"
            >
              {content.headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <div className="space-y-4 font-sans text-stone text-fluid-base leading-relaxed max-w-xl">
              {content.paragraphs.map((paragraph) => (
                <p data-reveal="copy" key={paragraph.slice(0, 48)}>
                  {paragraph}
                </p>
              ))}
            </div>

            <p
              data-reveal="copy"
              className="font-sans text-xs text-stone/80 leading-relaxed max-w-xl uppercase tracking-[0.16em]"
            >
              {content.approvalNote}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-wrap items-center gap-3 lg:justify-end">
            {onOpenPlans ? (
              <button
                type="button"
                onClick={onOpenPlans}
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full bg-gold hover:bg-gold-dark text-ink font-sans font-semibold text-xs tracking-[0.2em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory-soft"
              >
                {content.btnText}
              </button>
            ) : null}

            <div className="inline-flex items-center gap-2" role="group" aria-label="Floor plan carousel controls">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Previous floor plans"
                className="inline-flex h-11 w-11 items-center justify-center border border-ivory-border bg-ivory text-forest hover:border-gold disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Next floor plans"
                className="inline-flex h-11 w-11 items-center justify-center border border-ivory-border bg-ivory text-forest hover:border-gold disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {cards.length > 0 ? (
          <div className="relative">
            <div
              ref={scrollerRef}
              tabIndex={0}
              role="region"
              aria-label="Floor plan drawings"
              onKeyDown={onScrollerKeyDown}
              className="flex gap-4 overflow-x-auto overscroll-x-contain scroll-smooth snap-x snap-mandatory pb-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {cards.map((card, index) => (
                <article
                  key={card.src}
                  data-plan-card
                  data-reveal="item"
                  className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]"
                >
                  <button
                    type="button"
                    onClick={(event) => openAt(card.src, event.currentTarget)}
                    className="group flex h-full w-full flex-col text-left border border-ivory-border bg-ivory p-3 sm:p-4 transition-colors hover:border-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory-soft"
                    aria-label={`Enlarge ${card.title}`}
                    disabled={!onOpenLightbox}
                  >
                    <div className="relative w-full min-h-[14rem] sm:min-h-[16rem] bg-ivory-soft flex items-center justify-center">
                      <Image
                        src={card.src}
                        alt={card.alt}
                        width={card.width}
                        height={card.height}
                        sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                        className="h-auto max-h-[18rem] w-full object-contain"
                        priority={index < 3}
                        draggable={false}
                      />
                    </div>
                    <div className="mt-3 sm:mt-4 flex flex-wrap items-end justify-between gap-2">
                      <div className="min-w-0">
                        {index === 0 ? (
                          <p className="font-serif text-base sm:text-lg text-charcoal tracking-tight">
                            {card.title}
                          </p>
                        ) : null}
                        <p className="font-sans text-xs sm:text-sm text-charcoal tracking-wide leading-snug">
                          {card.caption}
                        </p>
                      </div>
                      {onOpenLightbox ? (
                        <span className="shrink-0 font-sans text-[10px] uppercase tracking-[0.18em] text-forest group-hover:underline">
                          Enlarge
                        </span>
                      ) : null}
                    </div>
                  </button>
                </article>
              ))}
            </div>

            {canNext ? (
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-14 bg-gradient-to-l from-ivory-soft to-transparent"
                aria-hidden="true"
              />
            ) : null}
            <p className="mt-3 font-sans text-[10px] uppercase tracking-[0.18em] text-stone">
              {canNext
                ? "Scroll or use arrows to see more plans"
                : "End of plans"}
            </p>
          </div>
        ) : (
          <p className="font-sans text-sm text-stone">
            {content.pendingLabel} — {content.pendingDetail}
          </p>
        )}
      </div>
    </section>
  );
}
