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

export default function BlogPostTemplate({ post }: BlogPostTemplateProps) {
  const readingTime = getReadingTimeMinutes(post.body);

  return (
    <main className="bg-(--bg) text-(--fg-muted)">
      <ReadingProgress targetId={ARTICLE_ID} />
      <article id={ARTICLE_ID} className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
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
          <p className="mt-4 max-w-3xl text-lg leading-8 text-(--fg-muted)">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-(--fg-subtle)">
            <time dateTime={post.publishedAt}>{formatPublishedDate(post.publishedAt)}</time>
            {post.author ? (
              <>
                <span aria-hidden="true">·</span>
                <span>By {post.author}</span>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <span>{readingTime} min read</span>
          </div>
        </header>

        {post.coverImage ? (
          <div className="mt-10 overflow-hidden rounded-2xl border border-(--border)">
            <Image
              src={urlFor(post.coverImage).width(1400).height(780).fit("crop").url()}
              alt={post.title}
              width={1400}
              height={780}
              preload
              sizes="(min-width: 896px) 856px, calc(100vw - 40px)"
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-10">
          <PortableTextRenderer value={post.body} />
        </div>
      </article>
    </main>
  );
}
