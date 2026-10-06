import Image from "next/image";
import { urlFor } from "@/lib/sanity.image";
import type { SanityPostListItem } from "@/lib/sanity.queries";

type PostThumbnailProps = {
  post: Pick<SanityPostListItem, "title" | "coverImage" | "category">;
  className?: string;
};

const iconProps = {
  "aria-hidden": true,
  viewBox: "0 0 24 24",
  className: "h-10 w-10",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Fallback artwork per category when a post has no cover image.
const categoryStyles: Record<string, { hue: number; icon: React.ReactNode }> = {
  tech: {
    hue: 215,
    icon: (
      <svg {...iconProps}>
        <path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
      </svg>
    ),
  },
  "self-hosting": {
    hue: 150,
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="4" width="18" height="6" rx="1.5" />
        <rect x="3" y="14" width="18" height="6" rx="1.5" />
        <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
      </svg>
    ),
  },
  reviews: {
    hue: 40,
    icon: (
      <svg {...iconProps}>
        <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
      </svg>
    ),
  },
  stories: {
    hue: 280,
    icon: (
      <svg {...iconProps}>
        <path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5Z" />
        <path d="M18 19v2H6a2 2 0 0 1-2-2M9 8h5" />
      </svg>
    ),
  },
};

const defaultStyle = {
  hue: 190,
  icon: (
    <svg {...iconProps}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h6" />
    </svg>
  ),
};

export default function PostThumbnail({ post, className = "" }: PostThumbnailProps) {
  const base = `relative block aspect-[16/10] overflow-hidden rounded-xl border border-(--border) bg-(--surface-2) ${className}`;

  if (post.coverImage) {
    return (
      <div className={base}>
        <Image
          src={urlFor(post.coverImage).width(640).height(400).fit("crop").url()}
          alt=""
          fill
          sizes="(min-width: 640px) 224px, 100vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  const { hue, icon } = categoryStyles[post.category?.slug ?? ""] ?? defaultStyle;

  return (
    <div
      className={`${base} flex items-center justify-center`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 70% 50% / 0.22), hsl(${hue} 70% 50% / 0.05))`,
        color: `hsl(${hue} 70% var(--thumb-l))`,
      }}
    >
      {icon}
    </div>
  );
}
