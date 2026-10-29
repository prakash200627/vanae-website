"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function OpeningLogoAnimation() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lightingRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const skipBtnRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [isRendered, setIsRendered] = useState(true);

  const finishAnimation = () => {
    document.body.style.overflow = "";
    if (typeof window !== "undefined") {
      gsap.set(["#main-navbar", "#hero-content"], { clearProps: "all" });
    }
    setIsRendered(false);
  };

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      finishAnimation();
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const safetyTimer = setTimeout(() => {
      finishAnimation();
    }, 4500);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(safetyTimer);
          finishAnimation();
        },
      });
      tlRef.current = tl;

      // 1. Initial State of Intro Panel elements
      gsap.set(logoWrapperRef.current, { opacity: 0, scale: 0.94, y: 15 });
      gsap.set(lineRef.current, { width: 0, opacity: 0 });
      gsap.set(subtitleRef.current, { opacity: 0, y: 10 });
      gsap.set(skipBtnRef.current, { opacity: 0 });
      if (lightingRef.current) gsap.set(lightingRef.current, { opacity: 0 });

      // Step 1: Allow current logo fade-up animation to complete
      tl.to(logoWrapperRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
      })
        // Step 1b: Gold hairline expand
        .to(
          lineRef.current,
          {
            width: "140px",
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
          },
          "-=0.35"
        )
        // Step 1c: Subtitle fade in
        .to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
          },
          "-=0.45"
        )
        // Step 1d: Skip button subtle fade in
        .to(
          skipBtnRef.current,
          {
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
          },
          "-=0.3"
        )
        // Step 2: Hold the completed logo screen briefly (0.6s)
        .to({}, { duration: 0.6 })
        // Fade skip button out right as transition begins
        .to(skipBtnRef.current, {
          opacity: 0,
          duration: 0.2,
          ease: "power2.out",
        });

      // Step 3, 4, 6: Sophisticated 3D flip transition around vertical axis
      if (lightingRef.current) {
        tl.to(
          lightingRef.current,
          {
            opacity: 0.45,
            duration: 1.15,
            ease: "power2.inOut",
          },
          "<"
        );
      }

      // Panel 3D vertical axis rotation reveal
      tl.to(
        panelRef.current,
        {
          rotateY: -72,
          z: -280,
          scale: 0.95,
          opacity: 0,
          duration: 1.15,
          ease: "power3.inOut",
        },
        "<"
      );
    }, wrapperRef);

    return () => {
      clearTimeout(safetyTimer);
      document.body.style.overflow = originalOverflow;
      if (typeof window !== "undefined") {
        gsap.set(["#main-navbar", "#hero-content"], { clearProps: "all" });
      }
      ctx.revert();
    };
  }, []);

  // Immediate Skip handler
  const handleSkip = () => {
    if (tlRef.current) {
      tlRef.current.kill();
    }
    finishAnimation();
  };

  if (!isRendered) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-[999999] pointer-events-none overflow-hidden select-none"
      style={{
        perspective: "2000px",
        perspectiveOrigin: "50% 50%",
      }}
    >
      {/* Full-Screen Forest-Green 3D Panel */}
      <div
        ref={panelRef}
        className="absolute inset-0 w-full h-full bg-[#0D5A46] flex flex-col items-center justify-center pointer-events-auto"
        style={{
          transformStyle: "preserve-3d",
          backfaceVisibility: "hidden",
          transformOrigin: "center center",
          willChange: "transform, opacity",
        }}
      >
        {/* Dynamic ambient depth lighting during 3D rotation */}
        <div
          ref={lightingRef}
          className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/30 via-transparent to-black/40"
          style={{ willChange: "opacity" }}
        />

        {/* Logo and Tagline Core Content (Kept exactly intact) */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
          {/* Actual VANAE Logo */}
          <div ref={logoWrapperRef} className="relative mb-6">
            <Image
              src="/assets/vanae-logo.jpg"
              alt="VANAE Residences"
              width={492}
              height={430}
              priority
              className="w-48 sm:w-60 md:w-72 h-auto object-contain pointer-events-none drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)]"
            />
          </div>

          {/* Elegant gold divider */}
          <div
            ref={lineRef}
            className="h-[1.5px] bg-gradient-to-r from-transparent via-[#c39663] to-transparent mx-auto mb-4"
          />

          {/* Subtle Luxury Caption */}
          <p
            ref={subtitleRef}
            className="font-sans text-[10px] sm:text-xs text-white/80 uppercase tracking-[0.35em] font-medium"
          >
            Ultra-Luxury Bespoke Residences
          </p>
        </div>

        {/* Skip button in bottom-right corner */}
        <button
          ref={skipBtnRef}
          onClick={handleSkip}
          className="absolute bottom-8 right-8 text-white/60 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-sans py-2 px-3.5 rounded border border-white/20 hover:border-white/50 bg-black/30 backdrop-blur-sm cursor-pointer z-20"
          aria-label="Skip intro animation"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
