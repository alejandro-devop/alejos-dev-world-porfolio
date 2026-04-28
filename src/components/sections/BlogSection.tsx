"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, stagger, defaultViewport } from "@/lib/motion";
import type { BlogData, BlogPost } from "@/types/content";
import type { Locale } from "@/config/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface BlogSectionProps {
  data: BlogData;
  locale: Locale;
}

function PostCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const href = `/${locale}/blog/${post.slug}`;
  const dateStr = new Date(post.publishedAt).toLocaleDateString(
    locale === "es" ? "es-AR" : "en-US",
    { year: "numeric", month: "short" },
  );

  return (
    <motion.article
      variants={fadeUp}
      className="group card-surface p-5 md:p-6 flex flex-col gap-4 h-full hover:shadow-sm transition-shadow duration-300"
    >
      <div className="flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-base text-foreground leading-snug group-hover:text-foreground/80 transition-colors">
          <Link
            href={href}
            className="focus-visible:outline-none focus-visible:underline"
            tabIndex={0}
          >
            {post.title}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.summary}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <time dateTime={post.publishedAt}>{dateStr}</time>
        <span>
          {post.readingTimeMinutes}
          {locale === "es" ? " min" : " min read"}
        </span>
      </div>
    </motion.article>
  );
}

export function BlogSection({ data, locale }: BlogSectionProps) {
  const published = data
    .filter((p) => p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 3);

  if (published.length === 0) return null;

  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="section-spacing container-page"
    >
      <SectionHeader
        id="blog-heading"
        label={locale === "es" ? "Escritura" : "Writing"}
        heading={locale === "es" ? "Últimos artículos" : "Latest posts"}
        description={
          locale === "es"
            ? "Reflexiones sobre arquitectura, TypeScript y el oficio de construir software."
            : "Thoughts on architecture, TypeScript, and the craft of building software."
        }
      />

      <motion.ul
        role="list"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {published.map((post) => (
          <li key={post.id}>
            <PostCard post={post} locale={locale} />
          </li>
        ))}
      </motion.ul>

      <div className="mt-8 flex justify-center">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:opacity-70 transition-opacity"
        >
          {locale === "es" ? "Ver todos los artículos" : "View all posts"}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
