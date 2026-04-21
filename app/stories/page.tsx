import BlogListSection from "@/components/blog/BlogListSection";
import { client } from "@/lib/sanity.client";
import {
  postsByCategoryQuery,
  type SanityPostListItem,
} from "@/lib/sanity.queries";

export default async function StoriesPage() {
  const posts = await client.fetch<SanityPostListItem[]>(postsByCategoryQuery, {
    slug: "stories",
  });

  return (
    <BlogListSection
      posts={posts}
      title="Stories"
      description="Personal writing, reflections, and smaller posts that do not fit a strict category."
      emptyMessage="No stories yet."
    />
  );
}
