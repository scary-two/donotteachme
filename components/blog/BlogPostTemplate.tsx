import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity.image";
import type { PortableTextBlock, SanityPost } from "@/lib/sanity.queries";

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

function getBlockText(block: PortableTextBlock) {
  return block.children?.map((child) => child.text).join("") ?? "";
}

function renderBlock(block: PortableTextBlock) {
  const text = getBlockText(block);

  if (!text.trim()) {
    return null;
  }

  if (block.style === "h2") {
    return (
      <h2 key={block._key} className="mt-10 text-2xl font-semibold text-white">
        {text}
      </h2>
    );
  }

  if (block.style === "h3") {
    return (
      <h3 key={block._key} className="mt-8 text-xl font-semibold text-white">
        {text}
      </h3>
    );
  }

  if (block.style === "blockquote") {
    return (
      <blockquote
        key={block._key}
        className="mb-6 border-l-2 border-green-400 pl-4 text-lg italic text-gray-300"
      >
        {text}
      </blockquote>
    );
  }

  return (
    <p key={block._key} className="mb-6 text-base leading-8 text-gray-300">
      {text}
    </p>
  );
}

export default function BlogPostTemplate({ post }: BlogPostTemplateProps) {
  return (
    <main className="bg-gray-900 text-gray-300">
      <article className="mx-auto max-w-4xl px-5 py-16 sm:py-20">
        <header className="border-b border-gray-800 pb-8">
          {post.category ? (
            <Link
              href={`/${post.category.slug}`}
              className="text-sm font-medium uppercase tracking-[0.2em] text-green-400 transition hover:text-green-300"
            >
              {post.category.title}
            </Link>
          ) : null}
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-400">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span>{formatPublishedDate(post.publishedAt)}</span>
            {post.author ? <span>By {post.author}</span> : null}
          </div>
        </header>

        {post.coverImage ? (
          <div className="mt-10 overflow-hidden rounded-2xl border border-gray-800">
            <Image
              src={urlFor(post.coverImage).width(1400).height(780).fit("crop").url()}
              alt={post.title}
              width={1400}
              height={780}
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mt-10">
          {post.body.map((block) => renderBlock(block))}
        </div>
      </article>
    </main>
  );
}
