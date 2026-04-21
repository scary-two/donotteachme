import BlogListSection from "@/components/blog/BlogListSection";
import { client } from "@/lib/sanity.client";
import {
  postsByCategoryQuery,
  type SanityPostListItem,
} from "@/lib/sanity.queries";

export default async function SelfHostingPage() {
  const posts = await client.fetch<SanityPostListItem[]>(postsByCategoryQuery, {
    slug: "self-hosting",
  });

  return (
    <BlogListSection
      posts={posts}
      title="Self Hosting"
      description="Homelab setups, server notes, and practical self-hosting experiments."
      emptyMessage="No self-hosting posts yet."
    />
  );
}
