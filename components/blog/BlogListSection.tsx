import Link from "next/link";
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
    <section className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <article
                key={post._id}
                className="rounded-2xl border border-gray-800 bg-gray-950/60 p-6 transition hover:border-gray-700"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="max-w-3xl">
                    {post.category ? (
                      <Link
                        href={`/${post.category.slug}`}
                        className="text-sm font-medium uppercase tracking-[0.2em] text-green-400 transition hover:text-green-300"
                      >
                        {post.category.title}
                      </Link>
                    ) : null}
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                      <Link
                        href={`/post/${post.slug}`}
                        className="transition hover:text-green-400"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-3 leading-7 text-gray-400">{post.excerpt}</p>
                    <Link
                      href={`/post/${post.slug}`}
                      className="mt-5 inline-flex items-center text-sm font-medium text-green-400 transition hover:text-green-300"
                    >
                      Read post
                    </Link>
                  </div>

                  <div className="min-w-44 text-sm text-gray-500">
                    <p>{formatPublishedDate(post.publishedAt)}</p>
                    {post.author ? <p className="mt-1">By {post.author}</p> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-800 bg-gray-950/40 p-10 text-center text-gray-400">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
