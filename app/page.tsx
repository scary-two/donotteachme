import BlogListSection from "@/components/blog/BlogListSection";
import {client} from "@/lib/sanity.client";
import {
  latestPostsQuery,
  type SanityPostListItem,
} from "@/lib/sanity.queries";

export default async function HomePage() {
  const posts = await client.fetch<SanityPostListItem[]>(latestPostsQuery);

  return (
    <BlogListSection
      posts={posts}
      title="Latest Posts"
      description="Find all the latest published posts here."
    />
  );
}
