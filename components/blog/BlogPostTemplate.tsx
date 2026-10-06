import Image from "next/image";
import Link from "next/link";
import PortableTextRenderer from "@/components/blog/PortableTextRenderer";
import { urlFor } from "@/lib/sanity.image";
import type { SanityPost } from "@/lib/sanity.queries";

type BlogPostTemplateProps = {
  post: SanityPost;
};

function formatPublishedDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPostTemplate({ post }: BlogPostTemplateProps) {
  return (
    <main className="bg-(--bg) text-(--fg-muted)">
      <article className="mx-auto max-w-4xl px-5 py-14 sm:py-20">
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
          <p className="mt-4 text-lg leading-8 text-(--fg-muted)">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--fg-subtle)">
            <span>{formatPublishedDate(post.publishedAt)}</span>
            {post.author ? <span>By {post.author}</span> : null}
          </div>
        </header>

        {post.coverImage ? (
          <div className="mt-10 overflow-hidden rounded-2xl border border-(--border)">
            <Image
              src={urlFor(post.coverImage).width(1400).height(780).fit("crop").url()}
              alt={post.title}
              width={1400}
              height={780}
              priority
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
