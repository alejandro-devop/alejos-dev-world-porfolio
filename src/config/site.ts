/**
 * Global site metadata.
 *
 * Single source of truth for the portfolio's name, description,
 * and deployment URL. Consumed by Next.js Metadata API and Open Graph.
 */
export const siteConfig = {
  name: "Alejo's Dev World",
  description: "Bilingual full-stack developer portfolio",
  url: "https://alejos-dev-world.vercel.app",
  /** Used for og:image and Twitter card. */
  ogImage: "/og.png",
} as const;
