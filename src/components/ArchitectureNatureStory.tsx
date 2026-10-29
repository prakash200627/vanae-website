"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { siteContent } from "@/data/siteContent";

interface ArchitectureNatureStoryProps {
  onPlayVideo?: () => void;
}

/**
 * Rooted Living story — three always-visible chapters in normal document flow.
 * No ScrollTrigger pin (avoids blank spacer regions). Rectangular media only.
 */
export default function ArchitectureNatureStory({
  onPlayVideo,
}: ArchitectureNatureStoryProps) {
  const story = siteContent.rootedStory;
  const chapters = story.panels;

  return (
    <section
      className="relative bg-ink text-ivory overflow-hidden"
      aria-labelledby="rooted-story-heading"
    >
      <div className="vanae-container pt-12 pb-12 md:pt-16 md:pb-20">
        <header className="max-w-2xl mb-8 md:mb-10">
          <p className="font-sans text-gold text-xs tracking-[0.28em] uppercase font-semibold mb-3">
            {story.eyebrow}
          </p>
          <h2
            id="rooted-story-heading"
            className="font-serif text-fluid-2xl md:text-fluid-3xl text-ivory font-normal tracking-tight"
          >
            {story.sectionHeading}
          </h2>
        </header>

        <div className="space-y-10 md:space-y-12">
          {chapters.map((chapter, index) => {
            const reverse = index % 2 === 1;
            const showImage =
              chapter.imageApproved === true && Boolean(chapter.image);

            return (
              <article
                key={chapter.title}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 lg:gap-10 items-center"
                aria-labelledby={`story-chapter-${index + 1}`}
              >
                <div
                  className={`md:col-span-6 ${
                    reverse ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <figure className="relative w-full max-w-lg mx-auto md:mx-0 md:max-w-none">
                    {showImage ? (
                      <div className="relative aspect-[4/5] overflow-hidden rounded-none bg-forest/30">
                        <Image
                          src={chapter.image}
                          alt={chapter.imageAlt}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover object-center"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div
                        className="relative aspect-[4/5] overflow-hidden rounded-none bg-forest/50 border border-ivory/10 flex flex-col items-center justify-center text-center px-8"
                        role="img"
                        aria-label={`${chapter.title} image pending`}
                      >
                        <span className="font-serif text-2xl text-ivory tracking-tight">
                          Image pending
                        </span>
                      </div>
                    )}
                  </figure>
                </div>

                <div
                  className={`md:col-span-6 ${
                    reverse ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <p className="font-sans text-[11px] tracking-[0.28em] text-gold uppercase mb-2">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    id={`story-chapter-${index + 1}`}
                    className="font-serif text-fluid-xl md:text-fluid-2xl text-ivory font-normal tracking-tight mb-3"
                  >
                    {chapter.title}
                  </h3>
                  <p className="font-sans text-fluid-base text-ivory/75 leading-relaxed max-w-md">
                    {chapter.body}
                  </p>
                </div>
              </article>
            );
          })}
        </div>

        {onPlayVideo && (
          <div className="mt-10 md:mt-12 pt-6 border-t border-ivory/10">
            <button
              type="button"
              onClick={onPlayVideo}
              className="inline-flex items-center gap-3 min-h-[48px] px-6 py-3 rounded-full border border-ivory/25 hover:border-gold text-ivory hover:text-gold font-sans text-xs tracking-[0.2em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              {story.videoCtaText}
            </button>
            <p className="mt-4 font-sans text-[11px] text-ivory/45 max-w-sm leading-relaxed">
              Film is an artist’s impression and may include AI-assisted
              visualisation.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
