"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type LightboxItem = {
  src: string;
  title: string;
  category?: string;
};

interface LightboxModalProps {
  items: LightboxItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  /** Control that opened the lightbox — focus returns here on close. */
  triggerRef?: React.RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function LightboxModal({
  items,
  currentIndex,
  onClose,
  onNavigate,
  triggerRef,
}: LightboxModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const isOpen = currentIndex !== null && items.length > 0;
  const safeIndex =
    currentIndex === null ? 0 : Math.max(0, Math.min(currentIndex, items.length - 1));
  const currentItem = items[safeIndex];
  const total = items.length;

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onNavigate((safeIndex - 1 + total) % total);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        onNavigate((safeIndex + 1) % total);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        return style.visibility !== "hidden" && style.display !== "none";
      });

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const triggerEl = triggerRef?.current ?? null;

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      triggerEl?.focus();
    };
  }, [isOpen, onClose, onNavigate, safeIndex, total, triggerRef]);

  if (!isOpen || !currentItem) return null;

  const goPrev = () => onNavigate((safeIndex - 1 + total) % total);
  const goNext = () => onNavigate((safeIndex + 1) % total);

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={currentItem.title}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        touchStartX.current = null;
        if (start === null || total < 2) return;
        const end = event.changedTouches[0]?.clientX ?? start;
        const delta = end - start;
        if (Math.abs(delta) < 56) return;
        if (delta > 0) goPrev();
        else goNext();
      }}
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-forest-nearBlack/95 backdrop-blur-xl"
        aria-hidden="true"
      />

      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Close lightbox"
        className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-gold text-white hover:text-luxury-black flex items-center justify-center transition-colors border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <X className="w-6 h-6" aria-hidden="true" />
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goPrev();
            }}
            aria-label="Previous image"
            className="absolute left-3 md:left-8 z-50 w-12 h-12 rounded-full bg-black/50 hover:bg-gold text-white hover:text-luxury-black flex items-center justify-center transition-colors border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goNext();
            }}
            aria-label="Next image"
            className="absolute right-3 md:right-8 z-50 w-12 h-12 rounded-full bg-black/50 hover:bg-gold text-white hover:text-luxury-black flex items-center justify-center transition-colors border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>
        </>
      )}

      <div className="relative z-10 max-w-5xl w-full flex flex-col items-center pointer-events-none">
        <div className="relative w-full h-[65vh] sm:h-[75vh] overflow-hidden border border-white/10 bg-black pointer-events-auto">
          <Image
            src={currentItem.src}
            alt={currentItem.title}
            fill
            priority
            sizes="100vw"
            className="object-contain"
          />
        </div>

        <div className="mt-4 text-center pointer-events-auto">
          <h3 className="font-serif text-xl text-ivory-soft font-normal">
            {currentItem.title}
          </h3>
          <span className="text-xs text-gold uppercase tracking-widest mt-1 block font-medium">
            {currentItem.category ? `${currentItem.category} · ` : ""}
            {safeIndex + 1} of {total}
          </span>
        </div>
      </div>
    </div>
  );
}
