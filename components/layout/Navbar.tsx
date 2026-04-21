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
  return (
    <header className="border-b border-gray-800 bg-gray-950/95 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        {/* <Link href="/" className="text-xl font-bold tracking-tight">
          Tech Blog
        </Link> */}
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/logo.png"
            alt="Site logo"
            width={140}
            height={40}
            className="h-auto"
          />
        </Link>
        <nav className="flex flex-wrap gap-4 text-sm md:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="font-medium text-gray-300 transition hover:text-green-400"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
