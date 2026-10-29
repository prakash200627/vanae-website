"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteContent } from "@/data/siteContent";

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

type DrawingSlide = {
  kind: "drawing";
  key: string;
  src: string;
  title: string;
  width: number;
  height: number;
  alt: string;
};

type PendingSlide = {
  kind: "pending";
  key: string;
  title: string;
  caption: string;
};

type CarouselSlide = DrawingSlide | PendingSlide;

const PENDING_SLOT_COUNT = 3;
const SWIPE_THRESHOLD_PX = 48;

/**
 * Rooted Living floor plans — one active slide, state-driven carousel.
 * Pending drawing-sheet slots while approved plans are unavailable.
 * Never presents lobby/spa/site photos as apartment floor plans.
 */
export default function FloorPlansSection({
  onOpenPlans,
  onOpenLightbox,
}: FloorPlansSectionProps) {
  const content = siteContent.floorPlans;
  const [activeIndex, setActiveIndex] = useState(0);
  const labelId = useId();
  const regionRef = useRef<HTMLDivElement>(null);
  const pointerOrigin = useRef<{ x: number; y: number } | null>(null);

  const slides: CarouselSlide[] = useMemo(() => {
    const approved = content.plans
      .filter((plan) => plan.drawingApproved === true && Boolean(plan.src))
      .slice(0, PENDING_SLOT_COUNT);

    if (approved.length > 0) {
      return approved.map((plan, index) => ({
        kind: "drawing" as const,
        key: `drawing-${plan.src}-${index}`,
        src: plan.src,
        title: plan.title,
        width: plan.width,
        height: plan.height,
        alt: plan.alt || `${plan.title} architectural floor-plan drawing`,
      }));
    }

    return Array.from({ length: PENDING_SLOT_COUNT }, (_, index) => ({
      kind: "pending" as const,
      key: `pending-${index + 1}`,
      title: content.pendingLabel,
      caption: content.pendingDetail,
    }));
  }, [content.plans, content.pendingLabel, content.pendingDetail]);

  const count = slides.length;
  const safeIndex =
    count === 0 ? 0 : ((activeIndex % count) + count) % count;
  const active = slides[safeIndex] ?? null;

  const lightboxItems: FloorPlanLightboxItem[] = useMemo(
    () =>
      slides
        .filter((slide): slide is DrawingSlide => slide.kind === "drawing")
        .map((slide) => ({
          src: slide.src,
          title: slide.title,
          category: "Floor plans",
        })),
    [slides]
  );

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count]
  );

  const goPrev = useCallback(
    () => goTo(safeIndex - 1),
    [goTo, safeIndex]
  );
  const goNext = useCallback(
    () => goTo(safeIndex + 1),
    [goTo, safeIndex]
  );

  const onRegionKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(count - 1);
    }
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerOrigin.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const origin = pointerOrigin.current;
    pointerOrigin.current = null;
    if (!origin) return;
    const dx = event.clientX - origin.x;
    const dy = event.clientY - origin.y;
    // Only treat clearly horizontal gestures as carousel swipes.
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    if (Math.abs(dx) <= Math.abs(dy)) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  const onPointerCancel = () => {
    pointerOrigin.current = null;
  };

  return (
    <section
      id="floor-plans"
      className="relative bg-ivory-soft text-charcoal overflow-x-hidden border-y border-ivory-border"
      aria-labelledby="floor-plans-heading"
    >
      <div className="vanae-container vanae-section">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-4 space-y-5">
            <p className="text-forest font-sans font-semibold text-xs tracking-[0.28em] uppercase">
              Floor plans
            </p>
            <h2
              id="floor-plans-heading"
              className="font-serif text-fluid-2xl md:text-fluid-3xl text-charcoal font-normal tracking-tight"
            >
              {content.headingLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>

            <div className="space-y-4 font-sans text-stone text-fluid-base leading-relaxed max-w-md">
              {content.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>

            <p className="font-sans text-xs text-stone/80 leading-relaxed max-w-md uppercase tracking-[0.16em]">
              {content.approvalNote}
            </p>

            {onOpenPlans && (
              <button
                type="button"
                onClick={onOpenPlans}
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full bg-gold hover:bg-gold-dark text-ink font-sans font-semibold text-xs tracking-[0.2em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory-soft"
              >
                {content.btnText}
              </button>
            )}
          </div>

          <div className="lg:col-span-8 min-w-0 w-full">
            <div
              ref={regionRef}
              role="region"
              aria-roledescription="carousel"
              aria-labelledby={labelId}
              tabIndex={0}
              onKeyDown={onRegionKeyDown}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerCancel}
              className="w-full max-w-full overflow-hidden rounded-none border border-ivory-border bg-ivory outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory-soft"
            >
              <p id={labelId} className="sr-only">
                Floor plan drawings carousel. Arrow keys change slides. Pending
                sheets are placeholders, not approved architectural drawings.
              </p>

              <div className="p-3 sm:p-4">
                {active?.kind === "drawing" ? (
                  <button
                    type="button"
                    onClick={(event) => {
                      const lightboxIndex = lightboxItems.findIndex(
                        (item) => item.src === active.src
                      );
                      if (lightboxIndex < 0) return;
                      onOpenLightbox?.(
                        lightboxItems,
                        lightboxIndex,
                        event.currentTarget
                      );
                    }}
                    className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                    aria-label={`Enlarge ${active.title}`}
                  >
                    <div className="relative w-full max-w-md mx-auto aspect-[3/4] max-h-[26rem] sm:max-h-[28rem] bg-ivory-soft border border-ivory-border overflow-hidden flex items-center justify-center">
                      <Image
                        key={active.src}
                        src={active.src}
                        alt={active.alt}
                        width={active.width}
                        height={active.height}
                        sizes="(max-width: 1024px) 90vw, 420px"
                        className="h-full w-full object-contain"
                        priority={safeIndex === 0}
                        draggable={false}
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap items-end justify-between gap-2 px-0.5">
                      <div>
                        <p className="font-serif text-base sm:text-lg text-charcoal tracking-tight">
                          {active.title}
                        </p>
                        <p className="mt-1 font-sans text-[10px] uppercase tracking-[0.16em] text-stone">
                          Illustrated layout · rights TO CONFIRM
                        </p>
                      </div>
                      {onOpenLightbox ? (
                        <span className="font-sans text-[11px] uppercase tracking-[0.18em] text-forest group-hover:underline">
                          View full size
                        </span>
                      ) : null}
                    </div>
                  </button>
                ) : active ? (
                  <div
                    className="relative w-full max-w-md mx-auto aspect-[3/4] max-h-[22rem] sm:max-h-[24rem] bg-ivory-soft border border-dashed border-stone/35 overflow-hidden flex flex-col items-center justify-center text-center px-6"
                    role="img"
                    aria-label={`${active.title}. ${active.caption}`}
                  >
                    <div
                      className="absolute inset-3 border border-stone/15 pointer-events-none"
                      aria-hidden="true"
                    />
                    <p className="relative font-sans text-[10px] uppercase tracking-[0.26em] text-forest mb-2.5">
                      Drawing sheet
                    </p>
                    <p className="relative font-serif text-xl sm:text-2xl text-ink tracking-tight max-w-[16rem]">
                      {active.title}
                    </p>
                    <p className="relative mt-2.5 font-sans text-[11px] uppercase tracking-[0.16em] text-stone">
                      {active.caption}
                    </p>
                    <span
                      className="relative mt-4 block h-px w-10 bg-gold/55"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ivory-border px-3 sm:px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={count < 2}
                    aria-label="Previous floor plan slide"
                    className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-none border border-ivory-border bg-ivory text-ink hover:border-gold disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={count < 2}
                    aria-label="Next floor plan slide"
                    className="w-10 h-10 min-h-[40px] min-w-[40px] rounded-none border border-ivory-border bg-ivory text-ink hover:border-gold disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>

                <p
                  className="font-sans text-xs tracking-[0.22em] uppercase text-stone tabular-nums"
                  aria-live="polite"
                >
                  {String(safeIndex + 1).padStart(2, "0")} /{" "}
                  {String(count).padStart(2, "0")}
                </p>

                <div
                  className="flex items-center gap-1.5"
                  role="tablist"
                  aria-label="Floor plan slides"
                >
                  {slides.map((slide, index) => {
                    const selected = index === safeIndex;
                    return (
                      <button
                        key={`dot-${slide.key}`}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-label={`Go to slide ${index + 1}`}
                        onClick={() => goTo(index)}
                        className="min-h-[40px] min-w-[40px] sm:min-h-0 sm:min-w-0 sm:h-auto sm:w-auto p-0 sm:p-1 rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold flex items-center justify-center"
                      >
                        <span
                          className={`block h-2 rounded-none transition-[width,background-color] ${
                            selected
                              ? "w-5 bg-forest"
                              : "w-2 bg-ivory-border hover:bg-stone/45"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {active?.kind === "pending" ? (
              <p className="mt-3 font-sans text-[11px] text-stone/75 leading-relaxed max-w-xl">
                Placeholder sheets only — not real floor plans. Approved
                drawings will replace these positions when available.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
