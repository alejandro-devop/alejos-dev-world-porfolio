import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales } from "@/config/i18n";
import type { Locale } from "@/config/i18n";
import { siteConfig } from "@/config/site";
import { getProject, getProjects, getSeo } from "@/lib/content";
import { JsonLd } from "@/components/JsonLd";
import { cn } from "@/lib/utils";
import { ProjectGallery } from "@/components/ui/ProjectGallery";
import type { Project, ProjectStatus } from "@/types/content";

// ── Route params ─────────────────────────────────────────────────────────────
interface ProjectParams {
  locale: string;
  id: string;
}
interface ProjectPageProps {
  params: Promise<ProjectParams>;
}

// ── Static generation ─────────────────────────────────────────────────────────
export async function generateStaticParams(): Promise<ProjectParams[]> {
  const results: ProjectParams[] = [];
  for (const locale of locales) {
    const projects = await getProjects(locale as Locale);
    for (const project of projects) {
      results.push({ locale, id: project.id });
    }
  }
  return results;
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale = (locales as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : "en";

  const project = await getProject(locale, id);
  if (!project) return {};

  const seo = await getSeo(locale);
  const canonicalUrl = `${siteConfig.url}/${locale}/projects/${project.id}`;
  const ogImage = project.imageUrl ?? seo.ogImage.url;

  return {
    title: project.title,
    description: project.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: project.title,
      description: project.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      creator: seo.twitterHandle,
      images: [ogImage],
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const STATUS_LABELS: Record<
  ProjectStatus,
  { en: string; es: string; color: string }
> = {
  completed: {
    en: "Completed",
    es: "Completado",
    color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  "in-progress": {
    en: "In Progress",
    es: "En progreso",
    color: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  archived: {
    en: "Archived",
    es: "Archivado",
    color: "bg-muted text-muted-foreground",
  },
};

function ArrowLeftIcon() {
  return (
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
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale: rawLocale, id } = await params;
  if (!(locales as readonly string[]).includes(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const project = await getProject(locale, id);
  if (!project) notFound();

  const status = STATUS_LABELS[project.status ?? "in-progress"];
  const hasImages = (project.images?.length ?? 0) > 0;
  const hasLinks = project.liveUrl || project.repoUrl;

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    author: {
      "@type": "Person",
      name: "Alejandro Gómez",
      url: siteConfig.url,
    },
    url: `${siteConfig.url}/${locale}/projects/${project.id}`,
    ...(project.imageUrl ? { image: project.imageUrl } : {}),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
    ...(project.tags?.length ? { keywords: project.tags.join(", ") } : {}),
  };

  return (
    <>
      <JsonLd data={projectSchema} />

      <div className="container-page section-spacing">
        {/* Breadcrumb */}
        <nav
          aria-label={locale === "es" ? "Migas de pan" : "Breadcrumb"}
          className="mb-10"
        >
          <ol className="flex items-center gap-2 text-sm text-muted-foreground" role="list">
            <li>
              <Link href={`/${locale}`} className="hover:text-foreground transition-colors">
                {locale === "es" ? "Inicio" : "Home"}
              </Link>
            </li>
            <li aria-hidden><span>/</span></li>
            <li>
              <Link href={`/${locale}#projects`} className="hover:text-foreground transition-colors">
                {locale === "es" ? "Proyectos" : "Projects"}
              </Link>
            </li>
            <li aria-hidden><span>/</span></li>
            <li aria-current="page" className="text-foreground font-medium truncate max-w-[200px]">
              {project.title}
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl space-y-10">
          {/* Header */}
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              {project.status && (
                <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", status.color)}>
                  {locale === "es" ? status.es : status.en}
                </span>
              )}
              {project.featured && (
                <span className="text-xs text-muted-foreground font-medium">
                  ★ {locale === "es" ? "Destacado" : "Featured"}
                </span>
              )}
              {project.startDate && (
                <span className="text-xs text-muted-foreground">
                  {project.startDate}
                  {project.endDate ? ` → ${project.endDate}` : ""}
                </span>
              )}
            </div>

            <h1 className="font-bold tracking-tight leading-tight">
              {project.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {project.description}
            </p>

            {/* Links */}
            {hasLinks && (
              <div className="flex flex-wrap gap-4 pt-1">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:opacity-70 transition-opacity"
                  >
                    <ExternalLinkIcon />
                    {locale === "es" ? "Ver demo" : "Live demo"}
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <GithubIcon />
                    {locale === "es" ? "Código fuente" : "Source code"}
                  </a>
                )}
              </div>
            )}
          </header>

          {/* Gallery */}
          {hasImages && (
            <section aria-label={locale === "es" ? "Galería de imágenes" : "Image gallery"}>
              <ProjectGallery images={project.images!} title={project.title} />
            </section>
          )}

          {/* Long description */}
          {project.longDescription && (
            <section aria-labelledby="project-details-heading" className="space-y-3">
              <h2
                id="project-details-heading"
                className="text-lg font-semibold text-foreground"
              >
                {locale === "es" ? "Sobre el proyecto" : "About this project"}
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                {project.longDescription}
              </p>
            </section>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <section aria-label={locale === "es" ? "Tecnologías" : "Technologies"}>
              <h2 className="text-sm font-semibold text-foreground mb-3">
                {locale === "es" ? "Tecnologías" : "Technologies"}
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Back link */}
          <div className="pt-4 border-t border-border">
            <Link
              href={`/${locale}#projects`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeftIcon />
              {locale === "es" ? "Volver a proyectos" : "Back to projects"}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
