"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { gsap } from "gsap";
import { MOTION, prefersReducedMotion } from "@/lib/motion";

/**
 * Full-viewport hero — looping film when motion is allowed (unmuted autoplay
 * attempted, muted fallback + sound controls), otherwise the approved dusk still.
 */
export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [reduceMotion, setReduceMotion] = useState(false);
  const [useVideo, setUseVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [soundControlVisible, setSoundControlVisible] = useState(false);

  const { hero } = siteContent;
  const imageSrc = hero.posterSrc;
  const videoSrc = hero.videoSrc?.trim() ?? "";
  const canAttemptVideo =
    Boolean(videoSrc) && !reduceMotion && !videoFailed;

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      const reduced = motionQuery.matches || prefersReducedMotion();
      setReduceMotion(reduced);
      if (reduced) {
        setUseVideo(false);
        setSoundControlVisible(false);
      }
    };
    sync();
    motionQuery.addEventListener("change", sync);
    return () => motionQuery.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!canAttemptVideo) {
      setUseVideo(false);
      setSoundControlVisible(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const markReady = (muted: boolean) => {
      if (cancelled) return;
      setIsMuted(muted);
      setSoundControlVisible(true);
      setUseVideo(true);
    };

    const markFailed = () => {
      if (cancelled) return;
      setVideoFailed(true);
      setUseVideo(false);
      setSoundControlVisible(false);
    };

    const tryPlay = async () => {
      if (cancelled) return;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.setAttribute("webkit-playsinline", "");
      video.loop = true;

      // 1) Attempt unmuted autoplay (may be blocked by the browser).
      try {
        video.muted = false;
        video.defaultMuted = false;
        video.removeAttribute("muted");
        await video.play();
        if (!cancelled) markReady(false);
        return;
      } catch {
        // fall through to muted autoplay
      }

      // 2) Fallback: muted autoplay + Enable Sound control.
      try {
        video.muted = true;
        video.defaultMuted = true;
        video.setAttribute("muted", "");
        await video.play();
        if (!cancelled) markReady(true);
      } catch {
        markFailed();
      }
    };

    if (video.readyState >= 2) {
      void tryPlay();
    } else {
      video.addEventListener("loadeddata", () => void tryPlay(), { once: true });
      video.addEventListener("canplay", () => void tryPlay(), { once: true });
    }

    video.addEventListener("error", markFailed);
    video.addEventListener("stalled", () => {
      if (video.currentTime === 0 && video.paused) {
        window.setTimeout(() => {
          if (!cancelled && video.paused && video.currentTime === 0) {
            markFailed();
          }
        }, 4000);
      }
    });

    return () => {
      cancelled = true;
      video.removeEventListener("error", markFailed);
      video.pause();
    };
  }, [canAttemptVideo, videoSrc]);

  // Keep control visible whenever the film is active; sync mute state from the element.
  useEffect(() => {
    if (!useVideo) return;
    const video = videoRef.current;
    if (!video) return;
    setSoundControlVisible(true);
    setIsMuted(video.muted);
  }, [useVideo]);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media || reduceMotion || prefersReducedMotion() || useVideo) return;

    gsap.set(media, { scale: 1, transformOrigin: "50% 50%" });
    const tween = gsap.to(media, {
      scale: 1.06,
      duration: 28,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tween.kill();
      gsap.set(media, { clearProps: "transform" });
    };
  }, [reduceMotion, useVideo]);

  useEffect(() => {
    const headline = headlineRef.current;
    if (!headline) return;

    if (reduceMotion || prefersReducedMotion()) {
      gsap.set(headline, { clearProps: "all" });
      return;
    }

    gsap.set(headline, { opacity: 0, y: 22 });
    const tween = gsap.to(headline, {
      opacity: 1,
      y: 0,
      duration: MOTION.duration,
      ease: MOTION.easeSoft,
      delay: 0.15,
    });

    return () => {
      tween.kill();
    };
  }, [reduceMotion]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video || !useVideo) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    if (!nextMuted) {
      video.volume = 1;
      // Resume if the browser paused while muted-to-unmuted.
      void video.play().catch(() => {
        /* keep current frame; user can retry */
      });
    }
    setIsMuted(nextMuted);
  };

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative w-full h-[100svh] min-h-[640px] sm:min-h-[720px] overflow-hidden bg-ink"
      aria-label="Vanae hero"
    >
      <div
        ref={mediaRef}
        data-hero-media
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className={`object-cover object-center transition-opacity duration-700 motion-reduce:transition-none ${
            useVideo ? "opacity-0" : "opacity-100"
          }`}
        />

        {canAttemptVideo ? (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 motion-reduce:transition-none ${
              useVideo ? "opacity-100" : "opacity-0"
            }`}
            src={videoSrc}
            poster={imageSrc}
            autoPlay
            loop
            playsInline
            preload="metadata"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
          />
        ) : null}
      </div>

      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-ink via-ink/55 to-ink/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(10,26,21,0.5)_100%)]"
        aria-hidden="true"
      />

      {useVideo && soundControlVisible ? (
        <div className="absolute bottom-6 left-4 sm:bottom-8 sm:left-8 z-20 pointer-events-auto">
          <button
            type="button"
            onClick={toggleMute}
            aria-pressed={!isMuted}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            title={isMuted ? "Unmute video" : "Mute video"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/45 bg-forest/90 text-ivory shadow-[0_8px_24px_rgba(10,26,21,0.35)] backdrop-blur-sm transition-colors motion-reduce:transition-none hover:border-gold hover:bg-forest-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4 text-gold" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4 text-gold" aria-hidden="true" />
            )}
          </button>
        </div>
      ) : null}

      <div
        id="hero-content"
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center text-center px-6 sm:px-12 md:px-16 lg:px-20 pb-[12.5rem] sm:pb-[14rem] lg:pb-20 xl:pb-16 pointer-events-none"
      >
        <h1
          ref={headlineRef}
          className="pointer-events-auto font-serif font-normal text-ivory text-[clamp(1.875rem,1rem+3.4vw,4rem)] leading-[1.12] tracking-[0.01em] max-w-[12.5em] [text-wrap:balance] drop-shadow-[0_2px_28px_rgba(10,26,21,0.75)]"
        >
          {hero.majorStatement}
        </h1>

        <p className="pointer-events-none mt-4 sm:mt-5 max-w-md font-sans text-sm sm:text-base text-ivory/85 leading-relaxed tracking-wide drop-shadow-[0_1px_12px_rgba(10,26,21,0.7)]">
          {hero.supportingCopy}
        </p>
      </div>
    </section>
  );
}
