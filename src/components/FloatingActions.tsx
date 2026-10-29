"use client";

import { FileText } from "lucide-react";
import { siteContent } from "@/data/siteContent";

interface FloatingActionsProps {
  onOpenEnquiry: () => void;
  enquiryButtonRef?: React.ComponentPropsWithRef<"button">["ref"];
  /** When true, hide floating controls so they do not compete with the modal. */
  isEnquiryOpen?: boolean;
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

/**
 * Floating Enquire + WhatsApp.
 * WhatsApp activates only when siteContent.whatsapp.phoneNumber yields a valid wa.me URL.
 * No invented numbers; empty config shows a disabled control so the channel is visible.
 */
export default function FloatingActions({
  onOpenEnquiry,
  enquiryButtonRef,
  isEnquiryOpen = false,
}: FloatingActionsProps) {
  const waData = siteContent.whatsapp;
  const whatsappHref = buildWhatsAppHref(
    waData?.phoneNumber || "",
    waData?.defaultMessage ||
    "Hello, I would like to inquire about VANAE luxury residences."
  );

  if (isEnquiryOpen) {
    return null;
  }

  return (
    <aside
      aria-label="Floating quick actions"
      className="fixed bottom-5 right-4 sm:bottom-7 sm:right-6 z-40 flex flex-col items-end gap-2.5 select-none pointer-events-none"
    >
      <div className="flex items-center gap-2.5 pointer-events-auto">
        <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-none bg-forest border border-gold/40 pointer-events-none">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ivory-soft font-medium whitespace-nowrap font-sans">
            Enquire
          </span>
        </span>

        <button
          ref={enquiryButtonRef}
          type="button"
          onClick={onOpenEnquiry}
          aria-label="Open enquiry form"
          aria-haspopup="dialog"
          className="relative min-w-12 min-h-12 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-gold hover:bg-gold-dark flex items-center justify-center border border-white/50 transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink cursor-pointer"
        >
          <FileText
            className="w-5 h-5 sm:w-6 sm:h-6 text-ink"
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex items-center gap-2.5 pointer-events-auto">
        <span className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-none bg-forest border border-gold/40 pointer-events-none">
          <span className="text-[11px] uppercase tracking-[0.2em] text-ivory-soft font-medium whitespace-nowrap font-sans">
            WhatsApp
          </span>
        </span>

        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="relative min-w-12 min-h-12 w-12 h-12 sm:w-14 sm:h-14 rounded-none bg-[#25D366] hover:bg-[#1ebe5d] text-white flex items-center justify-center border border-white/40 transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-ink cursor-pointer"
          >
            <WhatsAppGlyph className="w-6 h-6 sm:w-7 sm:h-7" />
          </a>
        ) : (
          <button
            type="button"
            disabled
            aria-label="Chat on WhatsApp — number pending confirmation"
            title="WhatsApp number TO CONFIRM"
            className="relative min-w-12 min-h-12 w-12 h-12 sm:w-14 sm:h-14 rounded-lg bg-[#25D366]/45 text-white/80 flex items-center justify-center border border-white/25 cursor-not-allowed opacity-70"
          >
            <WhatsAppGlyph className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}
      </div>
    </aside>
  );
}
