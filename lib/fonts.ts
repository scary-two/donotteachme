import { Inter, JetBrains_Mono, Source_Serif_4 } from "next/font/google";

// UI, headings, navigation: clean, neutral sans-serif.
export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Long-form article body: a readable serif designed for screens.
export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

// Code blocks.
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
