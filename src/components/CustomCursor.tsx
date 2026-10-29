"use client";

import { useEffect, useState, useRef } from "react";

/**
 * Desktop-only decorative cursor. Skipped on touch devices and when
 * prefers-reduced-motion is set so pointer tracking does not run.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncEnabled = () => {
      setEnabled(finePointer.matches && !motionQuery.matches);
    };
    syncEnabled();

    finePointer.addEventListener("change", syncEnabled);
    motionQuery.addEventListener("change", syncEnabled);
    return () => {
      finePointer.removeEventListener("change", syncEnabled);
      motionQuery.removeEventListener("change", syncEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let rafId = 0;
    const hoverCleanups: Array<() => void> = [];

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const bindHoverables = () => {
      hoverCleanups.splice(0).forEach((fn) => fn());
      const hoverables = document.querySelectorAll(
        "a, button, input, textarea, select, [role='button'], .cursor-hoverable"
      );
      hoverables.forEach((el) => {
        const onEnter = () => setIsHovered(true);
        const onLeave = () => setIsHovered(false);
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
        hoverCleanups.push(() => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        });
      });
    };

    const loop = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
      rafId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    bindHoverables();
    const observer = new MutationObserver(bindHoverables);
    observer.observe(document.body, { childList: true, subtree: true });

    loop();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      observer.disconnect();
      hoverCleanups.splice(0).forEach((fn) => fn());
      cancelAnimationFrame(rafId);
      setIsVisible(false);
      setIsHovered(false);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[999999] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold transition-opacity duration-300 motion-reduce:transition-none ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isHovered ? "w-2 h-2" : "w-1.5 h-1.5"}`}
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`fixed top-0 left-0 pointer-events-none z-[999998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/60 transition-all duration-300 ease-out motion-reduce:transition-none ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${
          isHovered
            ? "w-14 h-14 bg-gold/15 border-gold scale-110"
            : "w-8 h-8 scale-100"
        }`}
      />
    </>
  );
}
