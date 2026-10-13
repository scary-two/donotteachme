"use client";

import {useEffect, useRef} from "react";

type ReadingProgressProps = {
  /** id of the element whose height defines "the article". */
  targetId: string;
};

/**
 * Thin progress bar fixed to the top of the screen that fills as the article is read.
 * Updates the DOM directly (no React re-render per scroll event).
 */
export default function ReadingProgress({targetId}: ReadingProgressProps) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    const bar = barRef.current;

    if (!target || !bar) {
      return;
    }

    let frame = 0;

    function update() {
      frame = 0;
      const rect = (target as HTMLElement).getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress =
        scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;

      (bar as HTMLDivElement).style.transform = `scaleX(${progress})`;
    }

    function onScroll() {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, {passive: true});
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) {
        cancelAnimationFrame(frame);
      }
    };
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
    >
      <div
        ref={barRef}
        className="h-full origin-left bg-(--accent)"
        style={{transform: "scaleX(0)"}}
      />
    </div>
  );
}
