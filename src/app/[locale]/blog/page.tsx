import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/config/i18n";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getBlog, getSeo } from "@/lib/content";
import type { PageProps } from "@/types";
import type { BlogPost } from "@/types/content";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (locales as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : "en";
  const seo = await getSeo(locale);

  const title = locale === "es" ? "Blog" : "Blog";
  const description =
    locale === "es"
      ? "Artículos sobre desarrollo web, TypeScript, Next.js y buenas prácticas."
      : "Articles on web development, TypeScript, Next.js, and engineering best practices.";

  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${siteConfig.url}/${l}/blog`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages,
    },
    openGraph: {
      type: "website",
      url: `${siteConfig.url}/${locale}/blog`,
      title: `${title} | ${seo.title}`,
      description,
      images: [
        {
          url: seo.ogImage.url,
          width: seo.ogImage.width,
          height: seo.ogImage.height,
          alt: seo.ogImage.alt,
        },
      ],
    },
  };
}

function TagBadge({ tag }: { tag: string }) {
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
      {tag}
    </span>
  );
}

function PostCard({ post, locale }: { post: BlogPost; locale: Locale }) {
  const href = `/${locale}/blog/${post.slug}`;
  const dateStr = new Date(post.publishedAt).toLocaleDateString(
    locale === "es" ? "es-AR" : "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <article className="group card-surface p-5 md:p-6 flex flex-col gap-4 h-full hover:shadow-sm transition-shadow duration-300">
      <div className="flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </div>

      <div className="flex-1 space-y-2">
        <h2 className="font-semibold text-base md:text-lg text-foreground leading-snug group-hover:text-foreground/80 transition-colors">
          <Link
            href={href}
            className="focus-visible:outline-none focus-visible:underline"
          >
            {post.title}
          </Link>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {post.summary}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
        <time dateTime={post.publishedAt}>{dateStr}</time>
        <span>
          {post.readingTimeMinutes}
          {locale === "es" ? " min de lectura" : " min read"}
        </span>
      </div>

      <Link
        href={href}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:opacity-70 transition-opacity self-start"
        aria-label={`${locale === "es" ? "Leer" : "Read"}: ${post.title}`}
      >
        {locale === "es" ? "Leer artículo" : "Read article"}
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
    </article>
  );
}

export default async function BlogListPage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!(locales as readonly string[]).includes(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const allPosts = await getBlog(locale);
  const published = allPosts
    .filter((p) => p.status === "published")
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );

  return (
    <div className="container-page section-spacing">
      {/* Page header */}
      <header className="max-w-2xl space-y-3 mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {locale === "es" ? "Artículos" : "Writing"}
        </p>
        <h1 className="font-bold tracking-tight">
          {locale === "es" ? "Blog" : "Blog"}
        </h1>
        <p className="text-base text-muted-foreground">
          {locale === "es"
            ? "Reflexiones sobre arquitectura, TypeScript y el oficio de construir software."
            : "Thoughts on architecture, TypeScript, and the craft of building software."}
        </p>
      </header>

      {published.length === 0 ? (
        <p className="text-muted-foreground">
          {locale === "es"
            ? "No hay artículos publicados aún."
            : "No published posts yet."}
        </p>
      ) : (
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {published.map((post) => (
            <li key={post.id}>
              <PostCard post={post} locale={locale} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
