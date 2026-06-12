"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, scaleIn, defaultViewport } from "@/lib/motion";
import type { ProjectsData, Project, ProjectStatus } from "@/types/content";
import type { Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface ProjectsSectionProps {
  data: ProjectsData;
  locale: Locale;
}

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

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function isValidProject(project: Project): boolean {
  return (
    hasText(project.id) &&
    hasText(project.title) &&
    hasText(project.description) &&
    hasText(project.longDescription)
  );
}

function ProjectCard({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const status = STATUS_LABELS[project.status ?? "in-progress"];

  return (
    <motion.article
      variants={scaleIn}
      className={cn(
        "card-surface flex flex-col h-full p-5 md:p-6 gap-4",
        "group hover:shadow-sm transition-shadow duration-300",
      )}
    >
      {/* Image placeholder / decorative header */}
      {hasText(project.imageUrl) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.imageUrl!.trim()}
          alt={project.title}
          className="w-full h-44 object-cover rounded-lg bg-muted"
        />
      ) : (
        <div className="w-full h-32 rounded-lg bg-muted flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground/40"
            aria-hidden
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m9 9 5 5m0-5-5 5" />
          </svg>
        </div>
      )}

      {/* Meta */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "inline-block text-xs font-semibold px-2.5 py-1 rounded-full",
            status.color,
          )}
        >
          {locale === "es" ? status.es : status.en}
        </span>
        {project.featured && (
          <span className="text-xs text-muted-foreground font-medium">
            ★ {locale === "es" ? "Destacado" : "Featured"}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-base text-foreground leading-snug">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Tags */}
      {project.tags?.some(hasText) && (
        <div className="flex flex-wrap gap-1.5">
          {project.tags.filter(hasText).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Links */}
      {(hasText(project.liveUrl) || hasText(project.repoUrl)) && (
        <div className="flex gap-3 pt-1">
          {hasText(project.liveUrl) && (
            <a
              href={project.liveUrl!.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:opacity-70 transition-opacity"
            >
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
              {locale === "es" ? "Ver demo" : "Live demo"}
            </a>
          )}
          {hasText(project.repoUrl) && (
            <a
              href={project.repoUrl!.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
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
              {locale === "es" ? "Código" : "Source"}
            </a>
          )}
        </div>
      )}
    </motion.article>
  );
}

export function ProjectsSection({ data, locale }: ProjectsSectionProps) {
  const projects = data.filter(isValidProject);
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const isEmpty = projects.length === 0;

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="section-spacing w-full"
    >
      <div className="glass-card glass-card-bleed w-full">
        <div className="container-page py-12 md:py-16">
          <SectionHeader
        id="projects-heading"
        label={locale === "es" ? "Proyectos" : "Projects"}
        heading={locale === "es" ? "Trabajo seleccionado" : "Selected Work"}
        description={
          locale === "es"
            ? "Proyectos que demuestran mis habilidades y enfoque."
            : "Projects that showcase my skills and approach."
        }
      />

      {isEmpty ? (
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="mt-12 text-base text-muted-foreground leading-relaxed"
        >
          {locale === "es"
            ? "Aún no hay proyectos registrados."
            : "No projects have been added yet."}
        </motion.p>
      ) : (
        <>
          {featured.length > 0 && (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {featured.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  locale={locale}
                />
              ))}
            </motion.div>
          )}

          {rest.length > 0 &&
            (featured.length > 0 ? (
              <>
                <p className="mt-10 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {locale === "es" ? "Otros proyectos" : "Other projects"}
                </p>
                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={defaultViewport}
                  className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  {rest.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      locale={locale}
                    />
                  ))}
                </motion.div>
              </>
            ) : (
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="visible"
                viewport={defaultViewport}
                className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {rest.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    locale={locale}
                  />
                ))}
              </motion.div>
            ))}
        </>
      )}
        </div>
      </div>
    </section>
  );
}
