"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type HeroMediaMode = "pending" | "static" | "video";

interface HeroSectionProps {
  onOpenEnquiry?: () => void;
}

/**
 * Prefer static poster when motion is reduced or the network is constrained.
 */
function resolveHeroMediaMode(): Exclude<HeroMediaMode, "pending"> {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return "static";
  }

  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }
  ).connection;

  if (connection?.saveData) return "static";

  const type = connection?.effectiveType;
  if (type === "slow-2g" || type === "2g") return "static";

  return "video";
}

/**
 * Rooted Living hero — brand, one headline, one Enquire CTA, cinematic film.
 * Does not surface unverified project figures.
 */
export default function HeroSection({ onOpenEnquiry }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [mediaMode, setMediaMode] = useState<HeroMediaMode>("pending");
  const [videoFailed, setVideoFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      setReduceMotion(motionQuery.matches);
      setMediaMode(resolveHeroMediaMode());
    };
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);

    const connection = (
      navigator as Navigator & {
        connection?: EventTarget & {
          saveData?: boolean;
          effectiveType?: string;
        };
      }
    ).connection;

    const onConnectionChange = () => setMediaMode(resolveHeroMediaMode());
    connection?.addEventListener?.("change", onConnectionChange);

    return () => {
      motionQuery.removeEventListener("change", syncMotion);
      connection?.removeEventListener?.("change", onConnectionChange);
    };
  }, []);

  const showVideo = mediaMode === "video" && !videoFailed;

  useEffect(() => {
    if (reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.set(contentRef.current, { opacity: 1, y: 0 });
      }

      const mediaEl =
        showVideo && videoRef.current
          ? videoRef.current
          : containerRef.current?.querySelector<HTMLElement>("[data-hero-poster]");

      if (mediaEl) {
        gsap.to(mediaEl, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          y: 32,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "55% top",
            scrub: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [showVideo, mediaMode, reduceMotion]);

  useEffect(() => {
    if (!showVideo) return;
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(() => {
          // Autoplay blocked — poster remains visible underneath.
        });
      }
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener("loadeddata", tryPlay, { once: true });
    }

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.pause();
    };
  }, [showVideo]);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
    if (!videoRef.current.paused) return;
    void videoRef.current.play().catch(() => undefined);
  };

  const { hero, branding } = siteContent;
  const posterSrc = hero.posterSrc;

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-screen min-h-[640px] sm:min-h-[720px] overflow-hidden bg-ink flex items-center justify-center"
      aria-label="Vanae hero"
    >
      {/* Poster always painted first — fallback when video is off or fails */}
      <div
        data-hero-poster
        aria-hidden={showVideo ? true : undefined}
        className="absolute inset-0 w-full h-full bg-cover bg-center origin-center"
        style={{ backgroundImage: `url('${posterSrc}')` }}
      />

      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={posterSrc}
          onError={() => setVideoFailed(true)}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none origin-center"
        >
          <source src={hero.videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Restrained dark wash for ivory text — does not crop or hide film edges */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink via-ink/50 to-ink/45"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,26,21,0.5)_100%)]"
        aria-hidden="true"
      />

      {showVideo && (
        <button
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
          className="absolute bottom-24 left-6 md:bottom-28 md:left-12 z-20 w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-ink/60 border border-ivory/25 hover:border-gold hover:bg-gold/15 backdrop-blur-md flex items-center justify-center text-ivory hover:text-gold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" aria-hidden="true" />
          ) : (
            <Volume2 className="w-5 h-5" aria-hidden="true" />
          )}
        </button>
      )}

      <div
        id="hero-content"
        ref={contentRef}
        className="relative z-10 px-6 max-w-3xl mx-auto flex flex-col items-center text-center"
      >
        <div className="mb-8 md:mb-10 inline-flex items-center justify-center bg-forest rounded-xl px-3 py-1.5 md:px-3.5 md:py-2 border border-gold/40 shadow-md">
          <Image
            src={branding.logoLight}
            alt={branding.name}
            width={492}
            height={430}
            priority
            className="h-10 sm:h-11 md:h-12 w-auto object-contain"
          />
        </div>

        <h1 className="font-serif text-ivory text-fluid-2xl md:text-fluid-3xl font-normal tracking-wide max-w-2xl drop-shadow-[0_2px_24px_rgba(10,26,21,0.65)]">
          {hero.majorStatement}
        </h1>

        {onOpenEnquiry && (
          <button
            type="button"
            onClick={onOpenEnquiry}
            aria-label="Enquire about Vanae"
            className="mt-8 md:mt-10 inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full bg-gold hover:bg-ivory text-ink font-sans font-semibold text-xs tracking-[0.2em] uppercase transition-colors duration-300 shadow-luxury focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {hero.ctaText}
          </button>
        )}
      </div>

      {/* Legible disclosure — watermark must remain visible; do not crop to hide it */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[min(92vw,36rem)] text-center font-sans text-[10px] sm:text-[11px] leading-relaxed tracking-wide text-ivory/75 px-4">
        {hero.impressionNote}
      </p>
    </section>
  );
}
