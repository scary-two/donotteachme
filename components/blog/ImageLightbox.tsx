"use client";

import Image from "next/image";
import {useEffect, useRef} from "react";

export type LightboxImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type ImageLightboxProps = {
  images: LightboxImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

const SWIPE_DISTANCE = 50;

function ChevronIcon({direction}: {direction: "left" | "right"}) {
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
      <path d={direction === "left" ? "m15 6-6 6 6 6" : "m9 6 6 6-6 6"} />
    </svg>
  );
}

/**
 * Full-screen image viewer shared by single post images and image galleries.
 * - Esc closes, ArrowLeft / ArrowRight navigate, swipe works on touch screens.
 * - Page scroll is locked while open and focus returns to the opener on close.
 */
export default function ImageLightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: ImageLightboxProps) {
  const count = images.length;
  const current = images[index];
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartRef = useRef<{x: number; y: number} | null>(null);

  // Lock page scroll, move focus into the dialog, and restore both on close.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const {overflow} = document.body.style;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  // Keyboard: Esc, arrows, and a simple focus trap for Tab.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (count > 1 && event.key === "ArrowRight") {
        event.preventDefault();
        onIndexChange((index + 1) % count);
        return;
      }

      if (count > 1 && event.key === "ArrowLeft") {
        event.preventDefault();
        onIndexChange((index - 1 + count) % count);
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>("button");
        if (!focusable.length) {
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [count, index, onClose, onIndexChange]);

  if (!current) {
    return null;
  }

  function showPrevious() {
    onIndexChange((index - 1 + count) % count);
  }

  function showNext() {
    onIndexChange((index + 1) % count);
  }

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-[70] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label={current.alt ? `Expanded image: ${current.alt}` : "Expanded image"}
      onClick={onClose}
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
          if (dx < 0) {
            showNext();
          } else {
            showPrevious();
          }
        }
      }}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <span
          className="min-w-16 text-xs font-semibold uppercase tracking-[0.24em] text-gray-300 tabular-nums"
          aria-live="polite"
        >
          {count > 1 ? `${index + 1} / ${count}` : ""}
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onClose();
          }}
          className="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gray-100 transition-colors duration-200 hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label="Close image"
        >
          X CLOSE
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          width={current.width}
          height={current.height}
          sizes="100vw"
          className="h-auto max-h-[calc(100dvh-9rem)] w-auto max-w-[94vw] rounded-lg object-contain"
          onClick={(event) => event.stopPropagation()}
        />

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:left-6"
              aria-label="Previous image"
            >
              <ChevronIcon direction="left" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:right-6"
              aria-label="Next image"
            >
              <ChevronIcon direction="right" />
            </button>
          </>
        ) : null}
      </div>

      <div className="min-h-16 px-6 py-4 text-center text-sm italic text-gray-300">
        {current.alt ? (
          <span onClick={(event) => event.stopPropagation()}>{current.alt}</span>
        ) : null}
      </div>
    </div>
  );
}
