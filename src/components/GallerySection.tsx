"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { siteContent } from "@/data/siteContent";

export type GalleryLightboxItem = {
  src: string;
  title: string;
  category?: string;
};

interface GallerySectionProps {
  onOpenLightbox: (
    items: GalleryLightboxItem[],
    index: number,
    trigger: HTMLElement | null
  ) => void;
}

/**
 * Rooted Living gallery — horizontal snap rail (≈3 cards on desktop).
 * Only approved items with src open the lightbox.
 */
export default function GallerySection({ onOpenLightbox }: GallerySectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const allItems = siteContent.gallery.items;
  const approvedItems = allItems.filter(
    (item) => item.imageApproved === true && Boolean(item.src)
  );

  const lightboxItems: GalleryLightboxItem[] = approvedItems.map((item) => ({
    src: item.src,
    title: item.title,
    category: item.category,
  }));

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < max - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    const onResize = () => updateArrows();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [updateArrows, approvedItems.length]);

  const scrollByCard = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-gallery-card]");
    const gap = 16;
    const amount = card
      ? card.getBoundingClientRect().width + gap
      : el.clientWidth * 0.85;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section
      id="gallery"
      className="bg-ivory text-charcoal overflow-x-hidden"
      aria-labelledby="gallery-heading"
    >
      <div className="vanae-container pt-12 pb-14 md:pt-14 md:pb-16">
        <header className="max-w-2xl mb-6 md:mb-8">
          <span className="text-forest text-xs tracking-[0.28em] uppercase font-semibold block mb-3">
            {siteContent.gallery.tag}
          </span>
          <h2
            id="gallery-heading"
            className="font-serif text-fluid-2xl md:text-fluid-3xl text-charcoal font-normal tracking-tight"
          >
            {siteContent.gallery.headingLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-4 font-sans text-sm text-stone leading-relaxed">
            {siteContent.gallery.approvalNote}
          </p>
        </header>

        {approvedItems.length === 0 ? (
          <p className="font-sans text-stone">
            Gallery imagery pending approved photography.
          </p>
        ) : (
          <div className="relative">
            <div className="hidden sm:flex absolute -top-14 right-0 gap-2 z-10">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={!canPrev}
                aria-label="Previous gallery images"
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-ivory-border bg-ivory text-ink hover:border-gold disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <ChevronLeft className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={!canNext}
                aria-label="Next gallery images"
                className="w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-ivory-border bg-ivory text-ink hover:border-gold disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <ChevronRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <div
              ref={scrollerRef}
              onScroll={updateArrows}
              className="flex gap-4 overflow-x-auto overscroll-x-contain pb-2 snap-x snap-mandatory scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
              role="list"
              aria-label="Project gallery"
            >
              {approvedItems.map((item, index) => (
                <div
                  key={`${item.src}-${item.title}`}
                  role="listitem"
                  data-gallery-card
                  className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-0.5rem)] md:w-[calc((100%-2rem)/3)]"
                >
                  <button
                    ref={(el) => {
                      triggerRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={(event) =>
                      onOpenLightbox(
                        lightboxItems,
                        index,
                        event.currentTarget
                      )
                    }
                    className="group relative block w-full aspect-[4/3] overflow-hidden rounded-none bg-sage/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                    aria-label={`Open gallery image: ${item.title}`}
                  >
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 85vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover"
                      loading={index < 3 ? "eager" : "lazy"}
                      priority={index === 0}
                    />
                    <span className="sr-only">
                      {item.category ? `${item.category}. ` : ""}
                      {item.title}
                    </span>
                  </button>
                  <p className="mt-3 font-sans text-xs tracking-[0.16em] uppercase text-stone truncate">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
