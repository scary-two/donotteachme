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
  marks?: string[];
};

export type PortableTextLinkMark = {
  _key: string;
  _type: "link";
  href?: string;
};

export type PortableTextBlockNode = {
  _key: string;
  _type: "block";
  style?: string;
  children?: PortableTextSpan[];
  listItem?: "bullet" | "number";
  level?: number;
  markDefs?: PortableTextLinkMark[];
};

export type PortableTextImageNode = {
  _key: string;
  _type: "image";
  alt?: string;
  asset?: {
    url?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
        aspectRatio?: number;
      };
    };
  };
};

export type PortableTextCodeBlockNode = {
  _key: string;
  _type: "codeBlock";
  language?: string;
  code?: string;
};

export type PortableTextNode =
  | PortableTextBlockNode
  | PortableTextImageNode
  | PortableTextCodeBlockNode;

export type SanityPost = SanityPostListItem & {
  body: PortableTextNode[];
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
    body[]{
      ...,
      _type == "image" => {
        ...,
        asset->{
          url,
          metadata {
            dimensions
          }
        }
      }
    },
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
