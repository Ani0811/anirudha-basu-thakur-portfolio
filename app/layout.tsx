import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const displayFont = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

const bodyFont = Rajdhani({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Anirudha Basu Thakur | Software Engineer",
  description: "Portfolio for Anirudha Basu Thakur, an Entry-level Software Engineer and Full-Stack Developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
