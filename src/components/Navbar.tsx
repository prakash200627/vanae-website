"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/data/siteContent";
import MenuDrawer from "./MenuDrawer";

interface NavbarProps {
  onOpenRegister: () => void;
}

/** Enter compact (pill) mode once scroll passes this point. */
const COMPACT_ENTER_PX = 88;
/** Return to expanded top mode only after scrolling back below this (hysteresis). */
const COMPACT_EXIT_PX = 40;

/** Matches CSS morph `duration-morph` — action controls stay inert while chrome moves. */
const MORPH_LOCK_MS = 500;

/**
 * Rooted Living header: transparent at rest; ivory floating pill after scroll.
 * Scroll never opens the menu — only the explicit MENU control does.
 */
export default function Navbar({ onOpenRegister }: NavbarProps) {
  const [isCompact, setIsCompact] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  /** Blocks pointer hits on action controls while the header is morphing. */
  const [controlsLocked, setControlsLocked] = useState(false);
  const isCompactRef = useRef(false);
  const skipMorphLockRef = useRef(true);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduceMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);

    let ticking = false;

    const applyScrollState = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      const nextCompact = isCompactRef.current
        ? y > COMPACT_EXIT_PX
        : y >= COMPACT_ENTER_PX;

      if (nextCompact !== isCompactRef.current) {
        isCompactRef.current = nextCompact;
        setIsCompact(nextCompact);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(applyScrollState);
        ticking = true;
      }
    };

    if ((window.scrollY || 0) <= COMPACT_EXIT_PX) {
      isCompactRef.current = false;
      setIsCompact(false);
    } else {
      applyScrollState();
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      motionQuery.removeEventListener("change", syncMotion);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // While the header morphs, ignore pointer events on MENU / Register so a
  // finger lift over a remapped hit-target cannot synthesize an open click.
  useEffect(() => {
    if (skipMorphLockRef.current) {
      skipMorphLockRef.current = false;
      return;
    }

    if (reduceMotion) {
      setControlsLocked(false);
      return;
    }

    setControlsLocked(true);
    const unlockId = window.setTimeout(() => {
      setControlsLocked(false);
    }, MORPH_LOCK_MS);

    return () => {
      window.clearTimeout(unlockId);
    };
  }, [isCompact, reduceMotion]);

  const motionClass = reduceMotion
    ? "transition-none"
    : "transition-[top,left,right,width,max-width,height,padding,border-radius,background-color,border-color,box-shadow,backdrop-filter,transform] duration-morph ease-morph";

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed z-50 ${motionClass} ${
          isCompact
            ? "top-3 sm:top-4 md:top-5 left-1/2 right-auto -translate-x-1/2 w-[min(94vw,720px)] max-w-[calc(100vw-1.5rem)] h-[58px] sm:h-[64px] md:h-[68px] px-2.5 sm:px-3.5 md:px-4 rounded-full bg-ivory/95 backdrop-blur-xl border border-ivory-border/90 shadow-pill"
            : "top-0 left-0 right-0 translate-x-0 w-full max-w-none h-auto px-0 rounded-none bg-transparent backdrop-blur-none border border-transparent shadow-none"
        }`}
      >
        <div
          className={`flex items-center justify-between h-full w-full ${
            isCompact
              ? "gap-2 sm:gap-3"
              : "max-w-content mx-auto px-5 sm:px-6 md:px-12 py-5 md:py-7"
          } ${reduceMotion ? "" : "transition-[padding,gap] duration-morph ease-morph"}`}
        >
          <Link
            href="#home"
            className="flex items-center group shrink-0 min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
            aria-label="VANAE Home"
          >
            <div
              className={`relative flex items-center justify-center bg-forest border shadow-md ${
                reduceMotion ? "" : "transition-all duration-morph"
              } ${
                isCompact
                  ? "rounded-xl sm:rounded-2xl px-2 py-1 sm:px-2.5 sm:py-1.5 border-gold-pill/40 group-hover:border-gold shadow-sm"
                  : "rounded-xl px-2.5 py-1.5 md:px-3 md:py-2 border-gold/35 group-hover:border-gold"
              }`}
            >
              <Image
                src={siteContent.branding.logoLight}
                alt={siteContent.branding.name}
                width={492}
                height={430}
                priority
                className={`w-auto object-contain ${
                  reduceMotion ? "" : "transition-[height] duration-morph"
                } ${
                  isCompact
                    ? "h-7 sm:h-8 md:h-9"
                    : "h-9 sm:h-10 md:h-11"
                }`}
              />
            </div>
          </Link>

          <div
            className={`flex items-center shrink-0 ${
              isCompact ? "gap-1.5 sm:gap-2.5" : "space-x-4 sm:space-x-5 md:space-x-8"
            } ${controlsLocked ? "pointer-events-none" : ""}`}
          >
            <button
              type="button"
              onClick={onOpenRegister}
              aria-label="Register interest"
              className={`inline-flex items-center justify-center font-sans font-semibold tracking-wider uppercase cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                reduceMotion ? "" : "transition-all duration-morph"
              } ${
                isCompact
                  ? "h-10 sm:h-11 min-h-[44px] px-3.5 sm:px-5 rounded-full bg-gold text-ink text-[11px] sm:text-xs border border-gold-dark/80 shadow-sm active:scale-[0.98] hover:bg-gold-dark"
                  : "hidden sm:inline-flex min-h-[44px] px-6 py-2.5 rounded-full bg-gold hover:bg-ivory text-ink text-xs tracking-widest shadow-luxury border-0"
              }`}
            >
              <span className={isCompact ? "sm:hidden" : "hidden"}>ENQUIRE</span>
              <span className={isCompact ? "hidden sm:inline" : "inline"}>
                REGISTER NOW
              </span>
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="vanae-menu-drawer"
              aria-haspopup="dialog"
              className={`inline-flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                reduceMotion ? "" : "transition-all duration-morph"
              } ${
                isCompact
                  ? "gap-2 h-10 sm:h-11 min-h-[44px] min-w-[44px] px-3 sm:px-4 rounded-full bg-forest hover:bg-forest-deep text-ivory border border-forest-deep shadow-sm active:scale-[0.98]"
                  : "w-12 h-12 min-h-[44px] min-w-[44px] flex-col space-y-1.5 rounded-full border border-ivory/25 hover:border-gold bg-ink/40 hover:bg-gold/15 group"
              }`}
            >
              <span
                className={`flex-col items-center justify-center space-y-1.5 ${
                  isCompact ? "hidden" : "flex"
                }`}
                aria-hidden="true"
              >
                <span className="w-5 h-0.5 bg-ivory group-hover:bg-gold transition-colors duration-300" />
                <span className="w-4 h-0.5 bg-ivory group-hover:bg-gold transition-colors duration-300 group-hover:w-5" />
                <span className="w-5 h-0.5 bg-ivory group-hover:bg-gold transition-colors duration-300" />
              </span>
              <span
                className={`items-center gap-2 ${isCompact ? "inline-flex" : "hidden"}`}
                aria-hidden="true"
              >
                <span className="w-3.5 sm:w-4 h-2.5 sm:h-3 flex flex-col justify-between">
                  <span className="w-full h-0.5 bg-ivory rounded-full" />
                  <span className="w-full h-0.5 bg-ivory rounded-full" />
                  <span className="w-full h-0.5 bg-ivory rounded-full" />
                </span>
                <span className="font-sans text-[11px] sm:text-xs uppercase tracking-wider font-semibold text-ivory">
                  MENU
                </span>
              </span>
            </button>
          </div>
        </div>
      </header>

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenRegister={onOpenRegister}
        triggerRef={menuButtonRef}
      />
    </>
  );
}
