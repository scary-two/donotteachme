import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { inter, jetbrainsMono, sourceSerif } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Tech Blog",
  description: "A personal blog for tech, self hosting, reviews, and stories.",
};

/**
 * Theme tokens. Dark is the default; light applies when <html data-theme="light">.
 * Defined here so the whole redesign works by replacing .tsx files only.
 */
const themeCss = `
:root, :root[data-theme="dark"] {
  color-scheme: dark;
  --bg: #0b0e14;
  --surface: #11151d;
  --surface-2: #181d28;
  --border: #242b38;
  --fg: #e8ecf3;
  --fg-muted: #a6b0c0;
  --fg-subtle: #7a8598;
  --accent: #4ade80;
  --accent-hover: #86efac;
  --link: #60a5fa;
  --link-hover: #93c5fd;
  --code-bg: #0a0d13;
  --code-fg: #e6eaf2;
  --thumb-l: 68%;
  --logo-filter: none;
  --logo-blend: normal;
}
:root[data-theme="light"] {
  color-scheme: light;
  --bg: #fafaf8;
  --surface: #ffffff;
  --surface-2: #f3f3ef;
  --border: #e3e3dd;
  --fg: #181b21;
  --fg-muted: #4a5260;
  --fg-subtle: #6b7280;
  --accent: #15803d;
  --accent-hover: #166534;
  --link: #1d4ed8;
  --link-hover: #1e40af;
  --code-bg: #f5f6f8;
  --code-fg: #1f2430;
  --thumb-l: 36%;
  --logo-filter: invert(1) hue-rotate(180deg);
  --logo-blend: multiply;
}
`;

// Runs before first paint so there is no flash. Default = dark; a saved choice wins.
const themeInitScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-(--bg) text-(--fg) antialiased transition-colors duration-200`}
      >
        <Navbar />
        <div className="min-h-[calc(100vh-145px)]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
