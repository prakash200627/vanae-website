"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowUpRight, CheckCircle2, AlertCircle } from "lucide-react";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  formTitle?: string;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

type FieldErrors = {
  name?: string;
  email?: string;
  phone?: string;
};

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

function publicErrorMessage(raw: string): string {
  const lower = raw.toLowerCase();
  if (
    lower.includes("too many") ||
    lower.includes("temporarily unavailable") ||
    lower.includes("spam") ||
    lower.includes("required") ||
    lower.includes("valid email") ||
    lower.includes("too long") ||
    lower.includes("unable to submit")
  ) {
    return raw;
  }
  return "Unable to submit your enquiry. Please try again.";
}

export default function EnquiryModal({
  isOpen,
  onClose,
  title = "Register your interest",
  formTitle = "Register Your Interest",
  triggerRef,
}: EnquiryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website_trap: "",
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setStatus({ type: null, message: "" });
      setFieldErrors({});
      setIsSubmitting(false);
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Portal renders outside <main>, so inert on main is safe.
    const backgroundTargets = [
      document.querySelector("main"),
      document.querySelector('aside[aria-label="Floating quick actions"]'),
    ].filter((el): el is HTMLElement => el instanceof HTMLElement);

    backgroundTargets.forEach((el) => el.setAttribute("inert", ""));

    const timer = window.setTimeout(() => {
      firstInputRef.current?.focus();
    }, 80);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => {
        const style = window.getComputedStyle(el);
        return style.visibility !== "hidden" && style.display !== "none";
      });

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
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
      window.clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      backgroundTargets.forEach((el) => el.removeAttribute("inert"));
      window.removeEventListener("keydown", handleKeyDown);
      triggerEl?.focus();
    };
  }, [isOpen, onClose, triggerRef]);

  const validate = (): FieldErrors => {
    const errors: FieldErrors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();

    if (!trimmedName) errors.name = "Please enter your full name.";
    else if (trimmedName.length > 100) errors.name = "Name is too long.";

    if (!trimmedEmail) errors.email = "Please enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    } else if (trimmedEmail.length > 254) {
      errors.email = "Email is too long.";
    }

    if (!trimmedPhone || trimmedPhone.replace(/\D/g, "").length < 8) {
      errors.phone = "Please enter a valid phone number.";
    } else if (trimmedPhone.length > 30) {
      errors.phone = "Phone number is too long.";
    }

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setStatus({ type: null, message: "" });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const source = formTitle?.toLowerCase().includes("register")
        ? "register-interest"
        : "enquiry";

      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formTitle || "",
          source,
          website_trap: formData.website_trap,
        }),
      });

      let data: { success?: boolean; message?: string } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to submit your enquiry. Please try again."
        );
      }

      setStatus({
        type: "success",
        message:
          data.message ||
          "Your enquiry has been submitted successfully.",
      });
      setFormData({ name: "", email: "", phone: "", website_trap: "" });
      setFieldErrors({});

      window.setTimeout(() => {
        onClose();
      }, 2400);
    } catch (err: unknown) {
      const raw =
        err instanceof Error
          ? err.message
          : "Unable to submit your enquiry. Please try again.";
      setStatus({
        type: "error",
        message: publicErrorMessage(raw),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !mounted) return null;

  const dialog = (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-heading"
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={onClose}
        className="absolute inset-0 bg-forest-nearBlack/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto bg-ivory-soft border border-ivory-border rounded-2xl p-6 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.35)] text-charcoal"
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close enquiry form"
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-10 h-10 rounded-full border border-ivory-border bg-white/90 hover:bg-forest text-charcoal hover:text-ivory-soft flex items-center justify-center transition-colors shadow-sm z-20 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <div className="pr-10 mb-6 sm:mb-8">
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold-dark font-semibold block mb-2">
            Enquiries
          </span>
          <h2
            id="enquiry-modal-heading"
            className="font-serif text-2xl sm:text-3xl text-charcoal font-normal tracking-tight leading-snug mb-2"
          >
            {title}
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-stone font-medium font-sans">
            {formTitle}
          </p>
          <div className="h-px w-16 bg-gold/50 mt-4" aria-hidden="true" />
        </div>

        {status.type === "success" ? (
          <div className="py-8 text-center space-y-4" role="status" aria-live="polite">
            <div className="w-14 h-14 rounded-full bg-forest/10 border border-forest/30 flex items-center justify-center mx-auto text-forest">
              <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
            </div>
            <h3 className="font-serif text-2xl text-forest font-medium">
              Enquiry received
            </h3>
            <p className="text-stone text-sm leading-relaxed max-w-sm mx-auto font-sans">
              {status.message}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            noValidate
            aria-busy={isSubmitting}
          >
            {/* Honeypot — excluded from a11y tree and layout */}
            <div hidden aria-hidden="true">
              <label htmlFor={`${formId}-trap`}>Company website</label>
              <input
                id={`${formId}-trap`}
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website_trap}
                onChange={(e) =>
                  setFormData({ ...formData, website_trap: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor={`${formId}-name`}
                className="block text-xs uppercase tracking-wider text-stone mb-1.5 font-medium font-sans"
              >
                Full name <span className="text-gold-dark">*</span>
              </label>
              <input
                ref={firstInputRef}
                id={`${formId}-name`}
                type="text"
                name="fullName"
                autoComplete="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: undefined });
                }}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? `${formId}-name-error` : undefined}
                className="w-full px-4 py-3 rounded-lg bg-white border border-ivory-border focus:border-gold focus:ring-1 focus:ring-gold/30 text-charcoal placeholder-stone/50 text-sm outline-none transition-all disabled:opacity-60"
              />
              {fieldErrors.name && (
                <p id={`${formId}-name-error`} className="mt-1.5 text-xs text-rose-700 font-sans" role="alert">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${formId}-email`}
                className="block text-xs uppercase tracking-wider text-stone mb-1.5 font-medium font-sans"
              >
                Email address <span className="text-gold-dark">*</span>
              </label>
              <input
                id={`${formId}-email`}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@domain.com"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                }}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? `${formId}-email-error` : undefined}
                className="w-full px-4 py-3 rounded-lg bg-white border border-ivory-border focus:border-gold focus:ring-1 focus:ring-gold/30 text-charcoal placeholder-stone/50 text-sm outline-none transition-all disabled:opacity-60"
              />
              {fieldErrors.email && (
                <p id={`${formId}-email-error`} className="mt-1.5 text-xs text-rose-700 font-sans" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${formId}-phone`}
                className="block text-xs uppercase tracking-wider text-stone mb-1.5 font-medium font-sans"
              >
                Phone number <span className="text-gold-dark">*</span>
              </label>
              <input
                id={`${formId}-phone`}
                type="tel"
                name="phone"
                autoComplete="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: undefined });
                }}
                disabled={isSubmitting}
                aria-invalid={Boolean(fieldErrors.phone)}
                aria-describedby={fieldErrors.phone ? `${formId}-phone-error` : undefined}
                className="w-full px-4 py-3 rounded-lg bg-white border border-ivory-border focus:border-gold focus:ring-1 focus:ring-gold/30 text-charcoal placeholder-stone/50 text-sm outline-none transition-all disabled:opacity-60"
              />
              {fieldErrors.phone && (
                <p id={`${formId}-phone-error`} className="mt-1.5 text-xs text-rose-700 font-sans" role="alert">
                  {fieldErrors.phone}
                </p>
              )}
            </div>

            {status.type === "error" && (
              <div
                className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2.5 font-sans"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{status.message}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center space-x-2 min-h-[48px] px-8 py-3.5 rounded-full bg-gold hover:bg-forest text-luxury-black hover:text-ivory-soft font-medium text-xs tracking-[0.25em] uppercase transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ivory-soft"
              >
                <span>{isSubmitting ? "Sending…" : "Register interest"}</span>
                {!isSubmitting && <ArrowUpRight className="w-4 h-4 ml-1" aria-hidden="true" />}
              </button>
            </div>

            <p className="text-[11px] text-stone/80 font-sans leading-relaxed pt-1">
              By submitting, you agree to be contacted about VANAE residences.
            </p>
          </form>
        )}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}
