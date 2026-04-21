import BlogListSection from "@/components/blog/BlogListSection";
import { client } from "@/lib/sanity.client";
import {
  postsByCategoryQuery,
  type SanityPostListItem,
} from "@/lib/sanity.queries";

export default async function ReviewsPage() {
  const posts = await client.fetch<SanityPostListItem[]>(postsByCategoryQuery, {
    slug: "reviews",
  });

  return (
    <BlogListSection
      posts={posts}
      title="Reviews"
      description="Honest impressions of software, hardware, and tools I use."
      emptyMessage="No reviews yet."
    />
  );
}
