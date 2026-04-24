"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";

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

  return (
    <header className="border-b border-gray-800 bg-gray-950/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/logo.png"
              alt="Site logo"
              width={140}
              height={40}
              className="h-auto"
            />
          </Link>
          <button
            type="button"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-11 w-11 flex-col items-center justify-center gap-1.5 text-gray-400 transition-colors duration-200 hover:text-white md:hidden"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
          >
            <span className="h-0.5 w-5 rounded-full bg-current" />
            <span className="h-0.5 w-5 rounded-full bg-current" />
            <span className="h-0.5 w-5 rounded-full bg-current" />
          </button>
        </div>
        <nav
          className={`${isMobileMenuOpen ? "flex" : "hidden"} flex-col gap-4 text-sm md:flex md:flex-row md:items-center md:gap-6`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-medium text-gray-300 transition duration-200 hover:text-white hover:underline hover:underline-offset-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
