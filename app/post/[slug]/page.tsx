import { notFound } from "next/navigation";
import BlogPostTemplate from "@/components/blog/BlogPostTemplate";
import {client} from "@/lib/sanity.client";
import {
  singlePostQuery,
  type SanityPost,
} from "@/lib/sanity.queries";

type Props = {
  params: Promise<{slug: string}>;
};

export default async function PostPage({params}: Props) {
  const {slug} = await params;
  const post = await client.fetch<SanityPost | null>(singlePostQuery, {slug});

  if (!post) {
    notFound();
  }

  return <BlogPostTemplate post={post} />;
}
