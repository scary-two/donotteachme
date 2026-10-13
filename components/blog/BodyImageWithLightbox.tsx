"use client";

import Image from "next/image";
import {useState} from "react";
import ImageLightbox from "@/components/blog/ImageLightbox";
import {urlFor} from "@/lib/sanity.image";
import type {PortableTextImageNode} from "@/lib/sanity.queries";

type BodyImageWithLightboxProps = {
  image: PortableTextImageNode;
};

function noop() {}

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
            sizes="(min-width: 808px) 768px, calc(100vw - 40px)"
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
        <ImageLightbox
          images={[{src: lightboxSource, alt, width, height}]}
          index={0}
          onIndexChange={noop}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
}
