"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Play, X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

const DEFAULT_FILM = "/assets/videos/film.mp4";

/**
 * Full-screen promotional film player.
 * Media mounts only while open — avoids eagerly downloading a large MP4.
 * No autoplay with sound (browser policy); native controls + play affordance.
 */
export default function VideoModal({
  isOpen,
  onClose,
  videoUrl = DEFAULT_FILM,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();
  const [showPlayOverlay, setShowPlayOverlay] = useState(true);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const isLocalOrMp4 =
    videoUrl.endsWith(".mp4") || videoUrl.startsWith("/");

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    setShowPlayOverlay(true);
    setMediaError(null);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const videoEl = videoRef.current;

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (videoEl) {
        videoEl.pause();
        videoEl.removeAttribute("src");
        videoEl.load();
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    const video = videoRef.current;
    if (video) {
      video.pause();
    }
    onClose();
  };

  const handlePlayClick = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setShowPlayOverlay(false);
    } catch {
      setMediaError(
        "Playback could not start. Use the video controls, or try again."
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-lg"
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-5xl max-h-[min(80vh,100%)] aspect-video items-center justify-center bg-black overflow-hidden shadow-2xl border border-white/20">
        <h2 id={titleId} className="sr-only">
          VANAE architectural walkthrough
        </h2>

        <button
          ref={closeButtonRef}
          type="button"
          onClick={handleClose}
          aria-label="Close video"
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-50 w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-black/60 hover:bg-gold text-white hover:text-ink flex items-center justify-center transition-colors border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {isLocalOrMp4 ? (
          <>
            <video
              ref={videoRef}
              key={videoUrl}
              src={videoUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-black"
              onPlay={() => setShowPlayOverlay(false)}
              onPause={(event) => {
                if (event.currentTarget.currentTime === 0) {
                  setShowPlayOverlay(true);
                }
              }
              }
              onEnded={() => setShowPlayOverlay(true)}
              onError={() =>
                setMediaError(
                  "The video could not be loaded. Please try again later."
                )
              }
            />

            {showPlayOverlay && !mediaError ? (
              <button
                type="button"
                onClick={() => void handlePlayClick()}
                aria-label="Play video"
                className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-black/35 text-ivory hover:bg-black/45 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset"
              >
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/70 bg-forest/90 text-ivory shadow-[0_8px_28px_rgba(10,26,21,0.45)]">
                  <Play className="h-7 w-7 ml-0.5" aria-hidden="true" />
                </span>
                <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-ivory/90">
                  Play video
                </span>
              </button>
            ) : null}

            {mediaError ? (
              <p
                role="alert"
                className="absolute bottom-4 left-4 right-4 z-30 text-center font-sans text-sm text-ivory/90"
              >
                {mediaError}
              </p>
            ) : null}
          </>
        ) : (
          <iframe
            src={videoUrl}
            title="VANAE architectural walkthrough"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  );
}
