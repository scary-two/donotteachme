"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/layout/ThemeToggle";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tech", href: "/tech" },
  { name: "Self Hosting", href: "/self-hosting" },
  { name: "Reviews", href: "/reviews" },
  { name: "Stories", href: "/stories" },
  { name: "About", href: "/about" },
  { name: "Search", href: "/search" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-sm font-medium transition duration-200 hover:text-(--accent) ${
      isActive(href) ? "text-(--accent)" : "text-(--fg-muted)"
    }`;

  return (
    <header
      className="sticky top-0 z-40 border-b border-(--border) bg-(--bg)/90 backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape" && isMobileMenuOpen) {
          setIsMobileMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/logo.png"
            alt="donotteachme.com"
            width={140}
            height={35}
            priority
            className="h-auto w-[140px]"
            // The logo is a gradient on a dark background; this keeps it clean in light mode.
            style={{ filter: "var(--logo-filter)", mixBlendMode: "var(--logo-blend)" as never }}
          />
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={linkClass(link.href)}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            ref={menuButtonRef}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-(--fg) transition-colors duration-200 hover:bg-(--surface-2) hover:text-(--accent) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <svg
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d={isMobileMenuOpen ? "M6 6l12 12M6 18L18 6" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      <nav
        id="mobile-navigation"
        hidden={!isMobileMenuOpen}
        className={`${isMobileMenuOpen ? "flex" : "hidden"} flex-col gap-1 border-t border-(--border) px-5 py-3 md:hidden`}
        aria-label="Mobile"
      >
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`${linkClass(link.href)} rounded-lg px-2 py-2.5 hover:bg-(--surface-2)`}
            aria-current={isActive(link.href) ? "page" : undefined}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </header>
  );
}
