import type { SanityImageSource } from "@sanity/image-url";
import groq from "groq";

export type SanityCategory = {
  title: string;
  slug: string;
};

export type SanityPostListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  category: SanityCategory | null;
  author: string | null;
  coverImage?: SanityImageSource;
};

export type PortableTextSpan = {
  _key: string;
  _type: "span";
  text: string;
};

export type PortableTextBlock = {
  _key: string;
  _type: "block";
  style?: string;
  children?: PortableTextSpan[];
};

export type SanityPost = SanityPostListItem & {
  body: PortableTextBlock[];
};

const postListProjection = `
  _id,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  coverImage,
  "category": category->{
    title,
    "slug": slug.current
  },
  "author": author->name
`;

export const allPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc){
    ${postListProjection}
  }
`;

export const latestPostsQuery = groq`
  *[_type == "post"] | order(publishedAt desc)[0...10]{
    ${postListProjection}
  }
`;

export const postsByCategoryQuery = groq`
  *[_type == "post" && category->slug.current == $slug] | order(publishedAt desc)[0...10]{
    ${postListProjection}
  }
`;

export const singlePostQuery = groq`
  *[_type == "post" && slug.current == $slug][0]{
    ${postListProjection},
    body,
  }
`;

export const searchPostsQuery = groq`
  *[
    _type == "post" &&
    (
      title match $search ||
      excerpt match $search
    )
  ] | order(publishedAt desc)[0...10]{
    ${postListProjection}
  }
`;
