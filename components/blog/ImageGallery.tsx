"use client";

import Image from "next/image";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import ImageLightbox, {type LightboxImage} from "@/components/blog/ImageLightbox";
import {urlFor} from "@/lib/sanity.image";
import type {PortableTextImageNode} from "@/lib/sanity.queries";

/**
 * Renders the "Image gallery" block created in Sanity Studio:
 * one large image, arrows, a counter, a full-screen button and a thumbnail strip.
 */
type ImageGalleryProps = {
  images: PortableTextImageNode[];
};

// Article column is max-w-4xl (896px) with 20px side padding.
const STAGE_SIZES = "(min-width: 896px) 856px, calc(100vw - 40px)";
const SWIPE_DISTANCE = 40;

function Icon({path}: {path: string}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  );
}

const overlayButtonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black/70 text-white backdrop-blur-sm transition hover:bg-black/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70";

export default function ImageGallery({images}: ImageGalleryProps) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartRef = useRef<{x: number; y: number} | null>(null);

  const items = useMemo(
    () =>
      images
        .filter((image) => image.asset)
        .map((image) => ({
          alt: image.alt ?? "",
          width: image.asset?.metadata?.dimensions?.width ?? 1200,
          height: image.asset?.metadata?.dimensions?.height ?? 675,
          stage: urlFor(image).width(1600).fit("max").url(),
          thumb: urlFor(image).width(240).height(160).fit("crop").url(),
          full: urlFor(image).width(2200).height(1600).fit("max").url(),
        })),
    [images],
  );

  const count = items.length;
  const hasCaptions = items.some((item) => item.alt);

  const lightboxImages = useMemo<LightboxImage[]>(
    () =>
      items.map((item) => ({
        src: item.full,
        alt: item.alt,
        width: item.width,
        height: item.height,
      })),
    [items],
  );

  const go = useCallback(
    (step: number) => setIndex((current) => (current + step + count) % count),
    [count],
  );

  // Keep the active thumbnail centred in the strip without scrolling the page itself.
  useEffect(() => {
    const strip = stripRef.current;
    const thumb = thumbRefs.current[index];

    if (!strip || !thumb) {
      return;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    strip.scrollTo({
      left: thumb.offsetLeft - (strip.clientWidth - thumb.clientWidth) / 2,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [index]);

  if (count === 0) {
    return null;
  }

  const current = items[index];

  // Warm the cache for the next (and previous) image so switching feels instant.
  const preloadIndexes = new Set<number>();
  if (count > 1) {
    preloadIndexes.add((index + 1) % count);
    if (index > 0) {
      preloadIndexes.add(index - 1);
    }
  }

  return (
    <>
      <section
        className="my-10"
        aria-roledescription="carousel"
        aria-label={`Image gallery, ${count} images`}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            go(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1);
          }
        }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-(--border) bg-(--surface-2)">
          <div
            className="relative aspect-[4/3] w-full touch-pan-y sm:aspect-[16/10]"
            onTouchStart={(event) => {
              const touch = event.touches[0];
              touchStartRef.current = {x: touch.clientX, y: touch.clientY};
            }}
            onTouchEnd={(event) => {
              const start = touchStartRef.current;
              touchStartRef.current = null;

              if (!start || count < 2) {
                return;
              }

              const touch = event.changedTouches[0];
              const dx = touch.clientX - start.x;
              const dy = touch.clientY - start.y;

              if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.5) {
                go(dx < 0 ? 1 : -1);
              }
            }}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="absolute inset-0 cursor-zoom-in focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-(--accent)"
              aria-label={`Open image ${index + 1} of ${count} full screen`}
            >
              <Image
                src={current.stage}
                alt={current.alt}
                fill
                sizes={STAGE_SIZES}
                className="object-contain"
              />
            </button>

            {/* Hidden neighbours: same `sizes` as the stage so the browser caches the right file. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
            >
              {[...preloadIndexes].map((preloadIndex) => (
                <Image
                  key={`${preloadIndex}-${items[preloadIndex].stage}`}
                  src={items[preloadIndex].stage}
                  alt=""
                  fill
                  sizes={STAGE_SIZES}
                  loading="eager"
                />
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-3">
            <div className="pointer-events-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className={overlayButtonClass}
                aria-label="View full screen"
              >
                <Icon path="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              </button>
              <span
                className="rounded-lg bg-black/70 px-2.5 py-2 text-xs font-medium text-white tabular-nums backdrop-blur-sm"
                aria-live="polite"
              >
                {index + 1} / {count}
              </span>
            </div>

            {count > 1 ? (
              <div className="pointer-events-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className={overlayButtonClass}
                  aria-label="Previous image"
                >
                  <Icon path="m15 6-6 6 6 6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className={overlayButtonClass}
                  aria-label="Next image"
                >
                  <Icon path="m9 6 6 6-6 6" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        {hasCaptions ? (
          <p className="mt-3 min-h-6 px-1 text-center text-sm italic text-(--fg-subtle)">
            {current.alt}
          </p>
        ) : null}

        {count > 1 ? (
          <div
            ref={stripRef}
            className="relative mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]"
          >
            {items.map((item, itemIndex) => {
              const isActive = itemIndex === index;

              return (
                <button
                  key={`${itemIndex}-${item.thumb}`}
                  ref={(element) => {
                    thumbRefs.current[itemIndex] = element;
                  }}
                  type="button"
                  onClick={() => setIndex(itemIndex)}
                  aria-label={`Show image ${itemIndex + 1} of ${count}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative aspect-[3/2] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition sm:w-28 ${
                    isActive
                      ? "border-(--accent) opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={item.thumb}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        ) : null}
      </section>

      {lightboxOpen ? (
        <ImageLightbox
          images={lightboxImages}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </>
  );
}
