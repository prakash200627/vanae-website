"use client";

import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/data/siteContent";

interface FooterProps {
  onOpenEnquiry?: (trigger: HTMLButtonElement) => void;
}

/**
 * Rooted Living footer — brand, seven nav anchors, enquiry action.
 * Contact channels stay pending until verified; no invented legal copy.
 */
export default function Footer({ onOpenEnquiry }: FooterProps) {
  const navLinks = siteContent.navigation;
  const email = siteContent.contact.email.trim();
  const phone = siteContent.contact.phone.trim();
  const socials = siteContent.contact.socials.filter(
    (social) => Boolean(social.url?.trim())
  );

  return (
    <footer
      id="footer"
      className="relative bg-ink text-ivory-soft border-t border-white/10 pb-28 sm:pb-24"
    >
      <div className="vanae-container pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10 pb-12 border-b border-white/10">
          <div className="md:col-span-5 space-y-5">
            <Link
              href="#home"
              className="inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              aria-label="VANAE — Home"
            >
              <div className="inline-flex items-center justify-center bg-forest rounded-xl px-3 py-2 border border-gold/35">
                <Image
                  src={siteContent.branding.logoLight}
                  alt=""
                  width={492}
                  height={430}
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="font-serif text-lg text-ivory-soft tracking-wide">
              {siteContent.branding.name}
            </p>
            <p className="font-sans text-sm text-ivory-soft/70 leading-relaxed max-w-sm">
              {siteContent.location.publicPlace}
            </p>
          </div>

          <div className="md:col-span-4 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-semibold block">
              Explore
            </span>
            <nav aria-label="Footer navigation">
              <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-block text-xs sm:text-sm text-ivory-soft/75 hover:text-gold transition-colors motion-reduce:transition-none py-1.5 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="md:col-span-3 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-semibold block">
              Contact
            </span>

            {email ? (
              <a
                href={`mailto:${email}`}
                className="block text-sm text-ivory-soft hover:text-gold transition-colors motion-reduce:transition-none font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              >
                {email}
              </a>
            ) : (
              <p className="text-xs text-ivory-soft/55 font-sans">
                Sales email TO CONFIRM
              </p>
            )}

            {phone ? (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="block text-sm text-ivory-soft hover:text-gold transition-colors motion-reduce:transition-none font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              >
                {siteContent.contact.displayPhone || phone}
              </a>
            ) : (
              <p className="text-xs text-ivory-soft/55 font-sans">
                Phone TO CONFIRM
              </p>
            )}

            <p className="text-xs text-ivory-soft/45 font-sans">
              WhatsApp TO CONFIRM
            </p>

            {onOpenEnquiry && (
              <button
                type="button"
                onClick={(event) => onOpenEnquiry(event.currentTarget)}
                className="mt-1 inline-flex items-center justify-center min-h-[44px] px-5 py-2.5 rounded-full border border-gold/50 text-gold hover:bg-gold hover:text-ink font-sans text-xs tracking-[0.18em] uppercase transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Enquire
              </button>
            )}

            <p className="text-[11px] text-ivory-soft/40 leading-relaxed pt-2 font-sans">
              {siteContent.footer.reraNumber}
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-ivory-soft/50 font-sans">
          <p>{siteContent.footer.copyright}</p>
          {socials.length > 0 ? (
            <div className="flex flex-wrap items-center gap-5">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="uppercase tracking-wider hover:text-gold transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
                >
                  {social.short || social.name}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-ivory-soft/35">Social profiles TO CONFIRM</p>
          )}
        </div>
      </div>
    </footer>
  );
}
