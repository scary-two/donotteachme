import BlogListSection from "@/components/blog/BlogListSection";
import { client } from "@/lib/sanity.client";
import {
  allPostsQuery,
  searchPostsQuery,
  type SanityPostListItem,
} from "@/lib/sanity.queries";

type SearchPageProps = {
  searchParams?: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = searchParams ? await searchParams : {};
  const query = params.q ?? "";
  const searchPattern = `*${query}*`;
  const results = query
    ? await client.fetch<SanityPostListItem[]>(searchPostsQuery, {
        search: searchPattern,
      })
    : await client.fetch<SanityPostListItem[]>(allPostsQuery);

  return (
    <main className="bg-(--bg)">
      <section className="mx-auto max-w-6xl px-5 pt-16 sm:pt-20">
        <h1 className="text-4xl font-semibold tracking-tight text-(--fg)">
          Search
        </h1>
        <form className="mt-8">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search posts..."
            className="w-full rounded-xl border border-(--border) bg-(--surface) px-4 py-3 text-(--fg) outline-none transition placeholder:text-(--fg-subtle) focus:border-(--accent)"
          />
        </form>
      </section>

      <BlogListSection
        posts={results}
        title={query ? `Results for "${query}"` : "All Posts"}
        description="This page uses the shared Sanity-powered post list, so the same component can support home, categories, and search."
        emptyMessage={
          query
            ? `No posts matched "${query}".`
            : "No posts are available to search yet."
        }
      />
    </main>
  );
}
