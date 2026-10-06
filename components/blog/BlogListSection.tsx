import Link from "next/link";
import PostThumbnail from "@/components/blog/PostThumbnail";
import type { SanityPostListItem } from "@/lib/sanity.queries";

type BlogListSectionProps = {
  posts: SanityPostListItem[];
  title?: string;
  description?: string;
  emptyMessage?: string;
};

function formatPublishedDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BlogListSection({
  posts,
  title = "Latest Posts",
  description,
  emptyMessage = "No posts found yet.",
}: BlogListSectionProps) {
  return (
    <section className="bg-(--bg) text-(--fg-muted)">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-(--fg) sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-sm leading-7 text-(--fg-subtle) sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {posts.length > 0 ? (
          <div className="space-y-5">
            {posts.map((post) => (
              <article
                key={post._id}
                className="group flex flex-col gap-5 rounded-2xl border border-(--border) bg-(--surface) p-4 transition hover:border-(--accent)/50 hover:shadow-lg hover:shadow-black/5 sm:flex-row sm:items-center sm:p-5"
              >
                <Link
                  href={`/post/${post.slug}`}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="block w-full shrink-0 sm:w-56"
                >
                  <PostThumbnail post={post} />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-(--fg-subtle)">
                    {post.category ? (
                      <Link
                        href={`/${post.category.slug}`}
                        className="font-semibold uppercase tracking-[0.16em] text-(--accent) transition hover:text-(--accent-hover)"
                      >
                        {post.category.title}
                      </Link>
                    ) : null}
                    <span>{formatPublishedDate(post.publishedAt)}</span>
                    {post.author ? <span>By {post.author}</span> : null}
                  </div>

                  <h2 className="mt-2 text-xl font-semibold leading-snug tracking-tight text-(--fg) sm:text-2xl">
                    <Link
                      href={`/post/${post.slug}`}
                      className="transition hover:text-(--accent)"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-2 leading-7 text-(--fg-muted)">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/post/${post.slug}`}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-(--accent) transition hover:text-(--accent-hover)"
                  >
                    Read post <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-(--border) bg-(--surface) p-10 text-center text-(--fg-subtle)">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
