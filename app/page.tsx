import PortfolioClient from "./PortfolioClient";

export default function Portfolio() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Anirudha Basu Thakur",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://anirudha-basu-thakur-portfolio.vercel.app",
    "sameAs": [
      "https://github.com/Ani0811",
      "https://linkedin.com/in/anirudha-basu-thakur-686aa8253",
      "https://www.instagram.com/this_is_ringo_here/"
    ],
    "jobTitle": "Software Engineer & Full-Stack Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "G-One Media"
    },
    "knowsAbout": [
      "Software Engineering",
      "Full-Stack Web Development",
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Supabase",
      "Generative AI",
      "REST APIs"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Kolkata",
      "addressCountry": "India"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PortfolioClient />
    </>
  );
}
