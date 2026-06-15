import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anirudha-basu-thakur-portfolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Anirudha Basu Thakur | Software Engineer & Full-Stack Developer",
    template: "%s | Anirudha Basu Thakur"
  },
  description: "Portfolio of Anirudha Basu Thakur, a software engineer and full-stack developer based in Kolkata, India. Specialized in React, Next.js, Node.js, and AI systems.",
  keywords: [
    "Anirudha Basu Thakur",
    "Software Engineer",
    "Full-Stack Developer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "Web Developer Portfolio",
    "Kolkata India",
    "G-One Media",
    "Gemini AI"
  ],
  authors: [{ name: "Anirudha Basu Thakur" }],
  creator: "Anirudha Basu Thakur",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Anirudha Basu Thakur | Software Engineer & Full-Stack Developer",
    description: "Portfolio of Anirudha Basu Thakur, featuring custom full-stack solutions, G-One Media digital agency, Foodie Frenzy Ordering, and interactive AI capabilities.",
    siteName: "Anirudha Basu Thakur Portfolio",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "Anirudha Basu Thakur Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Anirudha Basu Thakur | Software Engineer & Full-Stack Developer",
    description: "Portfolio of Anirudha Basu Thakur, showcasing modern web systems, responsive design, and AI integrations.",
    images: ["/icon.png"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
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
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
