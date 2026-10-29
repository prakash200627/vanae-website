"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { siteContent } from "@/data/siteContent";

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
  /** Element that opened the drawer — focus returns here on close. */
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen Rooted Living navigation overlay.
 * Portaled to document.body so `inert` on <main> cannot disable close/links.
 * Opens only via the navbar MENU control — never from scroll.
 */
export default function MenuDrawer({
  isOpen,
  onClose,
  onOpenRegister,
  triggerRef,
}: MenuDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const node = panelRef.current;
    if (!node) return;
    if (isOpen) {
      node.removeAttribute("inert");
    } else {
      node.setAttribute("inert", "");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const backgroundTargets = [
      document.querySelector("main"),
      document.querySelector('aside[aria-label="Floating quick actions"]'),
    ].filter((el): el is HTMLElement => el instanceof HTMLElement);

    backgroundTargets.forEach((el) => el.setAttribute("inert", ""));

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => {
        if (el.hasAttribute("disabled")) return false;
        if (el.getAttribute("aria-hidden") === "true") return false;
        if (el.tabIndex < 0) return false;
        const style = window.getComputedStyle(el);
        return style.visibility !== "hidden" && style.display !== "none";
      });

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !panelRef.current.contains(active)) {
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
      backgroundTargets.forEach((el) => el.removeAttribute("inert"));
      triggerEl?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  const navItems = siteContent.navigation;

  const handleNavClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    onClose();
    if (!href.startsWith("#")) return;
    const id = href.slice(1);
    // Defer scroll until drawer closes / scroll-lock clears.
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 40);
    // Prevent default jump before close animation; we scroll manually.
    event.preventDefault();
  };

  const drawer = (
    <div
      ref={panelRef}
      id="vanae-menu-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[99999] ${
        isOpen
          ? "opacity-100 pointer-events-auto visible"
          : "opacity-0 pointer-events-none invisible"
      } motion-safe:transition-opacity motion-safe:duration-reveal motion-safe:ease-reveal`}
    >
      <div
        className="absolute inset-0 bg-ink motif-contour"
        onClick={onClose}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-forest/40" aria-hidden="true" />
      </div>

      <div className="relative z-10 h-full max-h-[100dvh] overflow-hidden pointer-events-none">
        <div className="h-full max-w-content mx-auto px-6 sm:px-10 md:px-16 py-5 sm:py-7 md:py-8 flex flex-col pointer-events-auto">
          <header className="shrink-0 flex items-start justify-between gap-4 mb-4 sm:mb-5">
            <Link
              href="#home"
              onClick={(event) => handleNavClick(event, "#home")}
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              aria-label="VANAE Home"
            >
              <div className="inline-flex items-center justify-center bg-forest rounded-xl px-2.5 py-1.5 border border-gold/35">
                <Image
                  src={siteContent.branding.logoLight}
                  alt=""
                  width={492}
                  height={430}
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain"
                />
              </div>
            </Link>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="shrink-0 w-11 h-11 min-h-[44px] min-w-[44px] rounded-full border border-ivory/20 bg-ink/70 text-ivory hover:border-gold hover:text-gold flex items-center justify-center transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </header>

          <p className="shrink-0 font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-gold/80 mb-3">
            Navigate
          </p>

          <nav
            aria-label="Primary"
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain py-1"
          >
            <ul className="list-none p-0 m-0 flex flex-col gap-0.5 sm:gap-1">
              {navItems.map((item, index) => {
                const number = String(index + 1).padStart(2, "0");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={(event) => handleNavClick(event, item.href)}
                      className="group flex items-baseline gap-4 sm:gap-6 md:gap-8 py-1.5 sm:py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink rounded-sm"
                    >
                      <span
                        className="font-sans text-[11px] sm:text-xs tracking-[0.2em] text-gold tabular-nums shrink-0 w-7 sm:w-8"
                        aria-hidden="true"
                      >
                        {number}
                      </span>
                      <span className="font-serif text-[clamp(1.5rem,4.2vh,3rem)] leading-none text-ivory group-hover:text-gold group-focus-visible:text-gold transition-colors duration-300 motion-reduce:transition-none tracking-wide">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <footer className="shrink-0 mt-4 sm:mt-5 pt-5 border-t border-ivory/10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="space-y-1.5 max-w-sm">
              <p className="font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-gold/70">
                Place
              </p>
              <p className="font-sans text-sm text-ivory/65 leading-relaxed">
                {siteContent.location.publicPlace}
              </p>
              <p className="font-sans text-xs text-ivory/40 leading-relaxed">
                Contact details TO CONFIRM
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                window.setTimeout(() => onOpenRegister(), 40);
              }}
              className="inline-flex items-center justify-center self-start sm:self-auto min-h-[44px] px-6 sm:px-8 py-2.5 rounded-full bg-gold hover:bg-ivory text-ink font-sans font-semibold text-xs tracking-[0.2em] uppercase transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              Register interest
            </button>
          </footer>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(drawer, document.body);
}
