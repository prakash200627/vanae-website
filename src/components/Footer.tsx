"use client";

import Image from "next/image";
import Link from "next/link";
import { siteContent } from "@/data/siteContent";

interface FooterProps {
  onOpenEnquiry?: (trigger: HTMLButtonElement) => void;
}

/**
 * Ink & Gold footer — brand, addresses, registration, copyright.
 * Background #0A1A15 · text #F4EFE6 · accents #C39663.
 */
export default function Footer({ onOpenEnquiry }: FooterProps) {
  const navLinks = siteContent.navigation;
  const email = siteContent.contact.email.trim();
  const phone = siteContent.contact.phone.trim();
  const socials = siteContent.contact.socials.filter(
    (social) => Boolean(social.url?.trim())
  );
  const { footer } = siteContent;

  return (
    <footer
      id="footer"
      className="relative bg-[#0A1A15] text-[#F4EFE6] border-t border-white/10 pb-28 sm:pb-24"
    >
      <div className="vanae-container pt-16 md:pt-20 lg:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10 lg:gap-12 pb-12 md:pb-14 border-b border-white/10">
          {/* Brand */}
          <div className="md:col-span-4 lg:col-span-3 space-y-5">
            <Link
              href="#home"
              className="inline-block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C39663] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A15]"
              aria-label="VANAE — Home"
            >
              <div className="inline-flex items-center justify-center bg-[#0D5A46] rounded-xl px-3 py-2 border border-[#C39663]/35">
                <Image
                  src={siteContent.branding.logoLight}
                  alt="VANAE"
                  width={492}
                  height={430}
                  className="h-12 w-auto object-contain"
                />
              </div>
            </Link>
            <p className="font-serif text-xl text-[#F4EFE6] tracking-wide">
              {siteContent.branding.name}
            </p>
            <p className="font-sans text-sm text-[#F4EFE6]/75 leading-relaxed max-w-sm">
              {footer.brandDescription}
            </p>

            {onOpenEnquiry && (
              <button
                type="button"
                onClick={(event) => onOpenEnquiry(event.currentTarget)}
                className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-full border border-[#C39663]/55 text-[#C39663] hover:bg-[#C39663] hover:text-[#0A1A15] font-sans text-xs tracking-[0.18em] uppercase transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C39663] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A1A15]"
              >
                Enquire
              </button>
            )}
          </div>

          {/* Explore */}
          <div className="md:col-span-3 lg:col-span-2 space-y-4">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#C39663] font-semibold block">
              Explore
            </span>
            <nav aria-label="Footer navigation">
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-4 gap-y-0.5">
                {navLinks.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-block text-xs sm:text-sm text-[#F4EFE6]/80 hover:text-[#C39663] transition-colors motion-reduce:transition-none py-1.5 font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C39663] rounded-sm"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Addresses */}
          <div className="md:col-span-5 lg:col-span-3 space-y-8">
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C39663] font-semibold block">
                {footer.mainOfficeLabel}
              </span>
              <p className="font-sans text-sm text-[#F4EFE6]/80 leading-relaxed">
                {footer.corporateAddress}
              </p>
            </div>
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C39663] font-semibold block">
                Project site
              </span>
              <p className="font-sans text-sm text-[#F4EFE6]/80 leading-relaxed">
                {footer.siteAddress}
              </p>
            </div>
          </div>

          {/* Registration + contact channels */}
          <div className="md:col-span-12 lg:col-span-4 min-w-0 space-y-8">
            <section
              className="space-y-3"
              aria-labelledby="footer-registration-heading"
            >
              <h2
                id="footer-registration-heading"
                className="text-[11px] uppercase tracking-[0.25em] text-[#C39663] font-semibold"
              >
                Registration
              </h2>
              <dl className="space-y-3 font-sans text-sm text-[#F4EFE6]/80">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.18em] text-[#F4EFE6]/45 mb-1">
                    RERA No.
                  </dt>
                  <dd className="tracking-wide">{footer.reraNumber}</dd>
                </div>
                {footer.hmdaNumber ? (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.18em] text-[#F4EFE6]/45 mb-1">
                      HMDA Application No.
                    </dt>
                    <dd className="whitespace-nowrap tabular-nums text-[12px] sm:text-sm lg:text-[13px] xl:text-sm tracking-normal">
                      {footer.hmdaNumber}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </section>

            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C39663] font-semibold block">
                Contact
              </span>
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="block text-sm text-[#F4EFE6] hover:text-[#C39663] transition-colors motion-reduce:transition-none font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C39663] rounded-sm"
                >
                  {email}
                </a>
              ) : null}
              {phone ? (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="block text-sm text-[#F4EFE6] hover:text-[#C39663] transition-colors motion-reduce:transition-none font-sans focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C39663] rounded-sm"
                >
                  {siteContent.contact.displayPhone || phone}
                </a>
              ) : (
                <p className="text-sm text-[#F4EFE6]/65 font-sans">
                  Reach us through the enquiry form
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-8 md:pt-10 pb-2 flex flex-col gap-3 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-[#F4EFE6]/45 font-sans">
            <p>{footer.copyright}</p>
            {socials.length > 0 ? (
              <div className="flex flex-wrap items-center gap-5">
                {socials.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="uppercase tracking-wider text-[#F4EFE6]/70 hover:text-[#C39663] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C39663] rounded-sm"
                  >
                    {social.short || social.name}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
