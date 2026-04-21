import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Tech Blog",
  description: "A personal blog for tech, self hosting, reviews, and stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-white antialiased">
        <Navbar />
        <div className="min-h-[calc(100vh-145px)]">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
