import Image from "next/image";
import Link from "next/link";
import PortableTextRenderer from "@/components/blog/PortableTextRenderer";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { urlFor } from "@/lib/sanity.image";
import type { PortableTextNode, SanityPost } from "@/lib/sanity.queries";

type BlogPostTemplateProps = {
  post: SanityPost;
};

const ARTICLE_ID = "post-article";
const WORDS_PER_MINUTE = 200;

function formatPublishedDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getReadingTimeMinutes(body: PortableTextNode[] | null | undefined) {
  const words = (body ?? []).reduce((total, node) => {
    if (node._type !== "block") {
      return total;
    }

    const text = (node.children ?? []).map((child) => child.text ?? "").join(" ");
    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function PostMeta({
  publishedAt,
  author,
  readingTime,
  className,
}: {
  publishedAt: string;
  author?: string | null;
  readingTime: number;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-sm ${className ?? ""}`}>
      <time dateTime={publishedAt}>{formatPublishedDate(publishedAt)}</time>
      {author ? (
        <>
          <span aria-hidden="true">·</span>
          <span>By {author}</span>
        </>
      ) : null}
      <span aria-hidden="true">·</span>
      <span>{readingTime} min read</span>
    </div>
  );
}

export default function BlogPostTemplate({ post }: BlogPostTemplateProps) {
  const readingTime = getReadingTimeMinutes(post.body);

  return (
    <main className="bg-(--bg) text-(--fg-muted)">
      <ReadingProgress targetId={ARTICLE_ID} />

      {post.coverImage ? (
        <section className="relative isolate flex min-h-[72vh] max-h-[860px] w-full items-end overflow-hidden bg-(--surface-2)">
          <Image
            src={urlFor(post.coverImage).width(2000).height(1200).fit("crop").url()}
            alt={post.title}
            fill
            preload
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/60 to-black/10"
          />
          <div className="mx-auto w-full max-w-4xl px-5 pb-12 sm:pb-16">
            {post.category ? (
              <Link
                href={`/${post.category.slug}`}
                className="text-sm font-semibold uppercase tracking-[0.16em] text-white/90 transition hover:text-white"
              >
                {post.category.title}
              </Link>
            ) : null}
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight wrap-break-word text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-5 max-w-3xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
                {post.excerpt}
              </p>
            ) : null}
            <PostMeta
              publishedAt={post.publishedAt}
              author={post.author}
              readingTime={readingTime}
              className="mt-6 text-white/75"
            />
          </div>
        </section>
      ) : null}

      <article id={ARTICLE_ID} className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
        {!post.coverImage ? (
          <header className="border-b border-(--border) pb-8">
            {post.category ? (
              <Link
                href={`/${post.category.slug}`}
                className="text-sm font-semibold uppercase tracking-[0.16em] text-(--accent) transition hover:text-(--accent-hover)"
              >
                {post.category.title}
              </Link>
            ) : null}
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-(--fg) sm:text-5xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-6 max-w-3xl text-lg leading-8 text-(--fg-muted)">{post.excerpt}</p>
            ) : null}
            <PostMeta
              publishedAt={post.publishedAt}
              author={post.author}
              readingTime={readingTime}
              className="mt-6 text-(--fg-subtle)"
            />
          </header>
        ) : (
          <div className="border-b border-(--border) pb-8">
            {post.excerpt ? null : null}
          </div>
        )}

        <div className="mt-10">
          <PortableTextRenderer value={post.body} />
        </div>
      </article>
    </main>
  );
}
