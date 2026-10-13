"use client";

import { useState } from "react";
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
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const linkClass = (href: string) =>
    `text-sm font-medium transition duration-200 hover:text-(--accent) ${
      isActive(href) ? "text-(--accent)" : "text-(--fg-muted)"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-(--border) bg-(--bg)/90 backdrop-blur">
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full text-(--fg-muted) transition-colors duration-200 hover:text-(--accent) md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span className="h-0.5 w-5 rounded-full bg-current" />
            <span className="h-0.5 w-5 rounded-full bg-current" />
            <span className="h-0.5 w-5 rounded-full bg-current" />
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <nav
          className="flex flex-col gap-1 border-t border-(--border) px-5 py-3 md:hidden"
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
      ) : null}
    </header>
  );
}
