"use client";

import Image from "next/image";
import {useEffect, useState} from "react";
import {urlFor} from "@/lib/sanity.image";
import type {PortableTextImageNode} from "@/lib/sanity.queries";

type BodyImageWithLightboxProps = {
  image: PortableTextImageNode;
};

export default function BodyImageWithLightbox({
  image,
}: BodyImageWithLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  const alt = image.alt ?? "";
  const width = image.asset?.metadata?.dimensions?.width ?? 1200;
  const height = image.asset?.metadata?.dimensions?.height ?? 675;
  const imageSource = image.asset ? urlFor(image).width(1600).fit("max").url() : null;
  const lightboxSource = image.asset
    ? urlFor(image).width(2200).height(1600).fit("max").url()
    : null;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    const {overflow} = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!imageSource || !lightboxSource) {
    return null;
  }

  return (
    <>
      <figure className="my-8 flex flex-col items-center">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full max-w-3xl"
          aria-label={alt ? `Open image: ${alt}` : "Open image"}
        >
          <Image
            src={imageSource}
            alt={alt}
            width={width}
            height={height}
            className="max-h-[520px] w-full rounded-lg border border-(--border) object-contain cursor-zoom-in"
          />
        </button>
        {alt ? (
          <figcaption className="mt-3 w-full max-w-3xl px-1 text-sm text-(--fg-subtle) italic text-center">
            {alt}
          </figcaption>
        ) : null}
      </figure>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/90 px-4 py-20"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt ? `Expanded image: ${alt}` : "Expanded image"}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setIsOpen(false);
            }}
            className="fixed left-1/2 top-6 -translate-x-1/2 rounded-full bg-black/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-gray-100 transition-colors duration-200 hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Close image"
          >
            X CLOSE
          </button>
          <div
            className="flex h-full items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={lightboxSource}
              alt={alt}
              width={width}
              height={height}
              className="max-h-[85vh] max-w-[90vw] w-auto rounded-lg object-contain"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
