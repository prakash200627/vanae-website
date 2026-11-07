"use client";

import { useEffect, type RefObject } from "react";
import { revealSection } from "@/lib/motion";

/**
 * Attach Rooted Living scroll reveals to a section element.
 * Cleans up GSAP context on unmount / Fast Refresh.
 */
export function useSectionReveal(
  ref: RefObject<HTMLElement | null>,
  deps: unknown[] = []
) {
  useEffect(() => {
    return revealSection(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- caller controls deps
  }, deps);
}
