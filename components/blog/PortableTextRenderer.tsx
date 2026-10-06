"use client";

import {useEffect, useRef, useState} from "react";
import {copyText} from "@/lib/clipboard";
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
  const [copyStatus, setCopyStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
  }, []);

  if (!block?.code) {
    return null;
  }

  async function handleCopy() {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setCopyStatus("copying");

    try {
      await copyText(block.code ?? "");
      setCopyStatus("copied");
      resetTimerRef.current = setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <div className="my-8 overflow-hidden rounded-2xl border border-(--border) bg-(--code-bg) shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-(--border) px-4 py-2">
        <div className="text-xs font-medium uppercase tracking-[0.2em] text-(--fg-subtle)">
          {formatLanguageLabel(block.language)}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          disabled={copyStatus === "copying"}
          className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--surface) px-3 py-1.5 text-xs font-medium text-(--fg-muted) transition hover:border-(--accent) hover:text-(--accent)"
          aria-label={copyStatus === "copied" ? "Copied to clipboard" : "Copy code block"}
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
            {copyStatus === "copied" ? (
              <path d="m5 12 4 4L19 6" />
            ) : (
              <>
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </>
            )}
          </svg>
          <span aria-live="polite">
            {copyStatus === "copied" ? "Copied!" : copyStatus === "copying" ? "Copying…" : "Copy"}
          </span>
        </button>
      </div>
      {copyStatus === "error" ? (
        <p role="status" className="px-4 pt-3 text-sm text-(--fg-muted)">
          Copy failed. Select the code below and copy it manually.
        </p>
      ) : null}
      <pre className="overflow-x-auto px-4 py-4 text-sm leading-7 text-(--code-fg)">
        <code className="whitespace-pre font-[family-name:var(--font-mono)]">{block.code}</code>
      </pre>
    </div>
  );
}

const components: PortableTextComponents = {
  block: {
    h1: ({children}) => (
      <h1 className="mt-12 text-3xl font-bold tracking-tight text-(--fg) sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({children}) => (
      <h2 className="mt-10 text-2xl font-bold tracking-tight text-(--fg) sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 className="mt-8 text-xl font-semibold tracking-tight text-(--fg) sm:text-2xl">
        {children}
      </h3>
    ),
    blockquote: ({children}) => (
      <blockquote className="my-8 border-l-4 border-(--accent) pl-5 text-xl italic leading-9 text-(--fg-muted)">
        {children}
      </blockquote>
    ),
    normal: ({children}) => (
      <p className="text-base leading-8 text-(--fg)">{children}</p>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="my-6 ml-6 list-disc space-y-2 pl-2 text-base leading-8 text-(--fg) marker:text-(--accent)">
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className="my-6 ml-6 list-decimal space-y-2 pl-2 text-base leading-8 text-(--fg) marker:text-(--accent)">
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
          className="font-medium text-(--link) underline decoration-(--link)/30 underline-offset-4 transition hover:text-(--link-hover) hover:decoration-current"
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
