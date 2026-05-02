"use client";

import {useState} from "react";
import {PortableText, type PortableTextComponents} from "@portabletext/react";
import BodyImageWithLightbox from "@/components/blog/BodyImageWithLightbox";
import type {
  PortableTextCodeBlockNode,
  PortableTextImageNode,
  PortableTextNode,
} from "@/lib/sanity.queries";

type PortableTextRendererProps = {
  value: PortableTextNode[];
};

type CodeBlockProps = {
  block: PortableTextCodeBlockNode;
};

type LinkMarkValue = {
  href?: string;
};

function formatLanguageLabel(language?: string) {
  if (!language) {
    return "Plain text";
  }

  return language.replace(/[-_]/g, " ");
}

function CodeBlock({block}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  if (!block?.code) {
    return null;
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(block.code ?? "");
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy code block", error);
    }
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-gray-800 bg-gray-950 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between gap-3 border-b border-gray-800 px-4 py-2">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
          {formatLanguageLabel(block.language)}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 rounded-full border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:border-gray-500 hover:text-white"
          aria-label="Copy code block"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-7 text-gray-100">
        <code className="font-mono whitespace-pre">{block.code}</code>
      </pre>
    </div>
  );
}

const components: PortableTextComponents = {
  block: {
    h1: ({children}) => (
      <h1 className="mt-12 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({children}) => (
      <h2 className="mt-10 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {children}
      </h3>
    ),
    blockquote: ({children}) => (
      <blockquote className="my-8 border-l-4 border-green-400 pl-5 text-lg italic leading-8 text-gray-300">
        {children}
      </blockquote>
    ),
    normal: ({children}) => (
      <p className="text-base leading-8 text-gray-300">{children}</p>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="my-6 ml-6 list-disc space-y-2 pl-2 text-base leading-8 text-gray-300 marker:text-green-400">
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className="my-6 ml-6 list-decimal space-y-2 pl-2 text-base leading-8 text-gray-300 marker:text-green-400">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({children}) => <li>{children}</li>,
    number: ({children}) => <li>{children}</li>,
  },
  marks: {
    link: ({children, value}) => {
      const link = value as LinkMarkValue;
      const href = link?.href;

      if (!href) {
        return <>{children}</>;
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-blue-400 transition hover:text-blue-300 hover:underline hover:underline-offset-4"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({value}) => {
      const image = value as PortableTextImageNode;
      if (!image?.asset) {
        return null;
      }

      return <BodyImageWithLightbox image={image} />;
    },
    codeBlock: ({value}) => {
      const block = value as PortableTextCodeBlockNode;

      return <CodeBlock block={block} />;
    },
  },
};

export default function PortableTextRenderer({
  value,
}: PortableTextRendererProps) {
  if (!value?.length) {
    return null;
  }

  return (
    <div className="space-y-6">
      <PortableText value={value} components={components} />
    </div>
  );
}
