import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Shared Rooted Living motion tokens — refined, consistent, not sluggish. */
export const MOTION = {
  ease: "power2.out",
  easeSoft: "power3.out",
  duration: 0.9,
  durationFast: 0.48,
  durationModal: 0.4,
  stagger: 0.08,
  staggerTight: 0.05,
  y: 22,
  ySmall: 14,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scroll-triggered editorial reveal for a section scope.
 * Uses from→to so a failed mid-animation still ends visible; once: true.
 */
export function revealSection(scope: HTMLElement | null): () => void {
  if (!scope || prefersReducedMotion()) return () => undefined;

  gsap.registerPlugin(ScrollTrigger);

  const ctx = gsap.context(() => {
    const eyebrow = scope.querySelector<HTMLElement>('[data-reveal="eyebrow"]');
    const heading = scope.querySelector<HTMLElement>('[data-reveal="heading"]');
    const copy = gsap.utils.toArray<HTMLElement>(
      scope.querySelectorAll('[data-reveal="copy"]')
    );
    const images = gsap.utils.toArray<HTMLElement>(
      scope.querySelectorAll('[data-reveal="image"]')
    );
    const items = gsap.utils.toArray<HTMLElement>(
      scope.querySelectorAll('[data-reveal="item"]')
    );

    const headerBits = [eyebrow, heading, ...copy].filter(
      (el): el is HTMLElement => Boolean(el)
    );

    if (headerBits.length) {
      gsap.fromTo(
        headerBits,
        { opacity: 0, y: MOTION.y },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.duration,
          ease: MOTION.ease,
          stagger: MOTION.stagger,
          immediateRender: false,
          scrollTrigger: {
            trigger: scope,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    images.forEach((image) => {
      gsap.fromTo(
        image,
        {
          opacity: 0,
          scale: 1.03,
          clipPath: "inset(6% 6% 6% 6%)",
        },
        {
          opacity: 1,
          scale: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: MOTION.duration,
          ease: MOTION.easeSoft,
          immediateRender: false,
          scrollTrigger: {
            trigger: image,
            start: "top 88%",
            once: true,
          },
        }
      );
    });

    if (items.length) {
      gsap.fromTo(
        items,
        { opacity: 0, y: MOTION.ySmall },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.durationFast + 0.15,
          ease: MOTION.ease,
          stagger: MOTION.staggerTight,
          immediateRender: false,
          scrollTrigger: {
            trigger: items[0],
            start: "top 90%",
            once: true,
          },
        }
      );
    }
  }, scope);

  return () => ctx.revert();
}

/**
 * Animate amenity names when the active category changes.
 * Overwrite:true avoids stacking competing tweens that leave rows invisible.
 */
export function revealAmenityItems(
  list: HTMLElement | null,
  key: string | number
): () => void {
  if (!list || prefersReducedMotion()) {
    if (list) {
      list
        .querySelectorAll<HTMLElement>("[data-amenity-item]")
        .forEach((el) => {
          el.style.opacity = "1";
          el.style.transform = "none";
        });
    }
    return () => undefined;
  }

  const ctx = gsap.context(() => {
    const rows = gsap.utils.toArray<HTMLElement>(
      list.querySelectorAll("[data-amenity-item]")
    );
    if (!rows.length) return;
    gsap.fromTo(
      rows,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: MOTION.ease,
        stagger: 0.04,
        overwrite: "auto",
      }
    );
  }, list);

  void key;
  return () => ctx.revert();
}
