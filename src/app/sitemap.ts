import type { MetadataRoute } from "next";
import { locales } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getBlog } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // ── Home pages ────────────────────────────────────────────────────────────
  for (const locale of locales) {
    const languages: Record<string, string> = {};
    for (const l of locales) {
      languages[l] = `${siteConfig.url}/${l}`;
    }
    entries.push({
      url: `${siteConfig.url}/${locale}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: { languages },
    });
  }

  // ── Blog list pages ───────────────────────────────────────────────────────
  for (const locale of locales) {
    entries.push({
      url: `${siteConfig.url}/${locale}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  // ── Blog post pages ───────────────────────────────────────────────────────
  // Collect all published posts across locales and deduplicate by id so we
  // can build hreflang alternates that point to each locale's slug.
  const postsByLocale = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getBlog(locale);
      return { locale, posts: posts.filter((p) => p.status === "published") };
    }),
  );

  // Build a map: postId → { [locale]: slug }
  const slugMap = new Map<string, Record<string, string>>();
  for (const { locale, posts } of postsByLocale) {
    for (const post of posts) {
      const existing = slugMap.get(post.id) ?? {};
      existing[locale] = post.slug;
      slugMap.set(post.id, existing);
    }
  }

  for (const { locale, posts } of postsByLocale) {
    for (const post of posts) {
      const slugsByLocale = slugMap.get(post.id) ?? {};
      const languages: Record<string, string> = {};
      for (const [l, slug] of Object.entries(slugsByLocale)) {
        languages[l] = `${siteConfig.url}/${l}/blog/${slug}`;
      }
      entries.push({
        url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "yearly",
        priority: 0.6,
        alternates:
          Object.keys(languages).length > 1 ? { languages } : undefined,
      });
    }
  }

  return entries;
}
