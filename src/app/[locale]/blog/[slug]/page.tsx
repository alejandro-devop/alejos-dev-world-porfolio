import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/config/i18n";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getBlog, getSeo } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import type { BlogPost, BlogContentBlock } from "@/types/content";

// ── Route params shape ──────────────────────────────────────────────────────
interface BlogPostParams {
  locale: string;
  slug: string;
}

interface BlogPostPageProps {
  params: Promise<BlogPostParams>;
}

// ── Static generation ───────────────────────────────────────────────────────
export async function generateStaticParams(): Promise<BlogPostParams[]> {
  const results: BlogPostParams[] = [];
  for (const locale of locales) {
    const posts = await getBlog(locale as Locale);
    for (const post of posts.filter((p) => p.status === "published")) {
      results.push({ locale, slug: post.slug });
    }
  }
  return results;
}

// ── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = (locales as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : "en";

  const posts = await getBlog(locale);
  const post = posts.find((p) => p.slug === slug && p.status === "published");
  if (!post) return {};

  const seo = await getSeo(locale);
  const canonicalUrl = `${siteConfig.url}/${locale}/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description: post.summary,
      publishedTime: post.publishedAt,
      authors: ["Alejandro Gómez"],
      tags: post.tags,
      images: post.coverImageUrl
        ? [{ url: post.coverImageUrl, width: 1200, height: 630, alt: post.title }]
        : [{ url: seo.ogImage.url, width: seo.ogImage.width, height: seo.ogImage.height, alt: seo.ogImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      creator: seo.twitterHandle,
      images: [post.coverImageUrl ?? seo.ogImage.url],
    },
  };
}

// ── Content renderer ─────────────────────────────────────────────────────────
function ContentRenderer({ blocks }: { blocks: BlogContentBlock[] }) {
  return (
    <div className="prose-content space-y-5">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return (
              <h2 key={i} className="text-xl md:text-2xl font-bold tracking-tight text-foreground mt-10 mb-3 first:mt-0">
                {block.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="text-lg md:text-xl font-semibold text-foreground mt-8 mb-2">
                {block.text}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="text-base text-muted-foreground leading-relaxed">
                {block.text}
              </p>
            );
          case "ul":
            return (
              <ul key={i} role="list" className="space-y-2 pl-0">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span aria-hidden className="mt-[6px] size-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case "code":
            return (
              <figure key={i} aria-label={`${block.lang} code example`}>
                <pre className="overflow-x-auto rounded-xl bg-muted px-5 py-4 text-sm font-mono text-foreground/90 leading-relaxed">
                  <code>{block.text}</code>
                </pre>
              </figure>
            );
          case "blockquote":
            return (
              <blockquote key={i} className="border-l-2 border-border pl-5 italic text-muted-foreground text-base leading-relaxed">
                {block.text}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!(locales as readonly string[]).includes(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const posts = await getBlog(locale);
  const post = posts.find((p) => p.slug === slug && p.status === "published");
  if (!post) notFound();

  const dateStr = new Date(post.publishedAt).toLocaleDateString(
    locale === "es" ? "es-AR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  // JSON-LD: Article structured data.
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Alejandro Gómez",
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: "Alejandro Gómez",
      url: siteConfig.url,
    },
    url: `${siteConfig.url}/${locale}/blog/${post.slug}`,
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <JsonLd data={articleSchema} />

      <div className="container-page section-spacing">
        {/* Breadcrumb nav */}
        <nav aria-label={locale === "es" ? "Migas de pan" : "Breadcrumb"} className="mb-10">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground" role="list">
            <li>
              <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
                {locale === "es" ? "Inicio" : "Home"}
              </Link>
            </li>
            <li aria-hidden>
              <span>/</span>
            </li>
            <li>
              <Link href={`/${locale}/blog`} className="hover:text-foreground transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden>
              <span>/</span>
            </li>
            <li aria-current="page" className="text-foreground font-medium truncate max-w-[200px]">
              {post.title}
            </li>
          </ol>
        </nav>

        <article className="max-w-2xl" aria-labelledby="post-title">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 id="post-title" className="font-bold tracking-tight mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-10 pb-10 border-b border-border">
            <span>Alejandro Gómez</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>{dateStr}</time>
            <span aria-hidden>·</span>
            <span>
              {post.readingTimeMinutes}
              {locale === "es" ? " min de lectura" : " min read"}
            </span>
          </div>

          {/* Lead / summary */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-medium">
            {post.summary}
          </p>

          {/* Body content */}
          {post.content && post.content.length > 0 ? (
            <ContentRenderer blocks={post.content} />
          ) : (
            <p className="text-muted-foreground italic">
              {locale === "es" ? "Contenido próximamente." : "Content coming soon."}
            </p>
          )}

          {/* Back link */}
          <div className="mt-16 pt-8 border-t border-border">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              {locale === "es" ? "Volver al blog" : "Back to blog"}
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
