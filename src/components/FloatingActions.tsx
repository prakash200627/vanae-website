"use client";

import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { gsap } from "gsap";
import { siteContent } from "@/data/siteContent";
import { MOTION, prefersReducedMotion } from "@/lib/motion";

interface FloatingActionsProps {
  onOpenEnquiry: () => void;
  enquiryButtonRef?: React.ComponentPropsWithRef<"button">["ref"];
  isEnquiryOpen?: boolean;
  /** Shared Concierge open state — hide Enquire/WhatsApp while panel is open. */
  isChatOpen?: boolean;
}

function buildWhatsAppHref(
  phoneNumber: string,
  defaultMessage: string
): string | null {
  const digits = phoneNumber.replace(/[^0-9]/g, "");
  if (!digits || digits.length < 8) return null;
  const text = encodeURIComponent(defaultMessage);
  return `https://wa.me/${digits}?text=${text}`;
}

function resolveWhatsAppHref(): string | null {
  const waData = siteContent.whatsapp;
  const configuredUrl = waData?.url?.trim();
  if (configuredUrl) return configuredUrl;
  return buildWhatsAppHref(
    waData?.phoneNumber || "",
    waData?.defaultMessage ||
      "Hello, I would like to inquire about VANAE luxury residences."
  );
}

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
      />
    </svg>
  );
}

const controlClass =
  "group pointer-events-auto inline-flex items-center gap-2.5 sm:gap-3 rounded-none bg-transparent border-0 p-0 focus-visible:outline-none";

const iconClass =
  "inline-flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl border shadow-[0_8px_24px_rgba(10,26,21,0.35)] backdrop-blur-md transition-all duration-300 motion-reduce:transition-none group-focus-visible:ring-2 group-focus-visible:ring-gold group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-ink";

/**
 * Solid ivory pill + forest-deep type — readable on dark hero and light amenities.
 * Never uses transparent dark text over either surface.
 */
const labelClass =
  "hidden sm:inline order-first font-sans text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-forest-deep bg-ivory rounded-full px-3.5 py-1.5 border border-ivory-border shadow-[0_4px_14px_rgba(10,26,21,0.18)] transition-colors duration-300 motion-reduce:transition-none group-hover:border-gold/50 group-hover:text-ink";

/**
 * Transparent floating contact dock (Enquire + WhatsApp).
 * Concierge lives in Chatbot; both share open state from the page.
 * Desktop: ivory pill labels + icons. Mobile: icons only.
 */
export default function FloatingActions({
  onOpenEnquiry,
  enquiryButtonRef,
  isEnquiryOpen = false,
  isChatOpen = false,
}: FloatingActionsProps) {
  const rootRef = useRef<HTMLElement>(null);
  const whatsappHref = resolveWhatsAppHref();
  const dockHidden = isEnquiryOpen || isChatOpen;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (dockHidden) {
      el.setAttribute("inert", "");
    } else {
      el.removeAttribute("inert");
    }
  }, [dockHidden]);

  useEffect(() => {
    if (dockHidden || !rootRef.current || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const rows = rootRef.current?.querySelectorAll("[data-dock-item]");
      if (!rows?.length) return;
      gsap.fromTo(
        rows,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: MOTION.durationFast,
          ease: MOTION.ease,
          stagger: 0.07,
          delay: 0.25,
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, [dockHidden]);

  return (
    <aside
      ref={rootRef}
      aria-label="Contact"
      aria-hidden={dockHidden ? true : undefined}
      className={`fixed bottom-5 right-3 sm:bottom-7 sm:right-5 z-40 flex flex-col items-end gap-3 sm:gap-3.5 bg-transparent select-none transition-opacity duration-200 motion-reduce:transition-none ${
        dockHidden
          ? "opacity-0 pointer-events-none invisible"
          : "opacity-100 pointer-events-none visible"
      }`}
    >
      <button
        data-dock-item
        ref={enquiryButtonRef}
        type="button"
        onClick={onOpenEnquiry}
        tabIndex={dockHidden ? -1 : undefined}
        aria-label="Open enquiry form"
        aria-haspopup="dialog"
        disabled={dockHidden}
        className={controlClass}
      >
        <span className={labelClass}>Enquire</span>
        <span
          className={`${iconClass} border-gold/60 bg-gold text-ink group-hover:bg-ivory group-hover:border-gold group-hover:shadow-[0_10px_28px_rgba(195,150,99,0.4)] group-active:scale-[0.97]`}
        >
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
        </span>
      </button>

      {whatsappHref ? (
        <a
          data-dock-item
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={dockHidden ? -1 : undefined}
          aria-label="Chat on WhatsApp"
          className={controlClass}
        >
          <span className={labelClass}>WhatsApp</span>
          <span
            className={`${iconClass} border-forest/40 bg-forest text-ivory group-hover:bg-forest-deep group-hover:border-gold/50 group-hover:shadow-[0_10px_28px_rgba(13,90,70,0.45)] group-active:scale-[0.97]`}
          >
            <WhatsAppGlyph className="h-5 w-5" />
          </span>
        </a>
      ) : (
        <button
          data-dock-item
          type="button"
          disabled
          tabIndex={-1}
          aria-label="WhatsApp — use the enquiry form to reach us"
          title="WhatsApp available once a number is published"
          className={`${controlClass} opacity-55 cursor-not-allowed`}
        >
          <span className={labelClass}>WhatsApp</span>
          <span
            className={`${iconClass} border-forest/30 bg-forest/70 text-ivory/80`}
          >
            <WhatsAppGlyph className="h-5 w-5" />
          </span>
        </button>
      )}
    </aside>
  );
}
