import BlogListSection from "@/components/blog/BlogListSection";
import {client} from "@/lib/sanity.client";
import {
  postsByCategoryQuery,
  type SanityPostListItem,
} from "@/lib/sanity.queries";

export default async function TechPage() {
  const posts = await client.fetch<SanityPostListItem[]>(
    postsByCategoryQuery,
    {slug: "tech"},
  );

  return (
    <BlogListSection
      posts={posts}
      title="Tech"
      description="Notes, tutorials, and tools from day-to-day development."
      emptyMessage="No tech posts yet."
    />
  );
}
