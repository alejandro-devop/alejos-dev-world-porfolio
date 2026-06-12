"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, fadeIn, stagger, defaultViewport } from "@/lib/motion";
import type { ExperienceData, ExperienceEntry } from "@/types/content";
import type { Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface ExperienceSectionProps {
  data: ExperienceData;
  locale: Locale;
}

function formatDate(dateStr: string, locale: Locale): string {
  if (dateStr === "present") {
    return locale === "es" ? "Presente" : "Present";
  }
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString(locale === "es" ? "es-AR" : "en-US", {
    year: "numeric",
    month: "short",
  });
}

function ExperienceCard({
  entry,
  locale,
  isLast,
}: {
  entry: ExperienceEntry;
  locale: Locale;
  isLast: boolean;
}) {
  const startLabel = formatDate(entry.startDate, locale);
  const endLabel = formatDate(entry.endDate, locale);
  const [showTech, setShowTech] = useState(false);

  return (
    <motion.div variants={fadeUp} className="relative pl-8 md:pl-10">
      {/* Timeline line */}
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[7px] md:left-[9px] top-6 bottom-0 w-px bg-border"
        />
      )}

      {/* Timeline dot */}
      <span
        aria-hidden
        className="absolute left-0 top-1.5 size-3.5 rounded-full border-2 border-border bg-background"
      />

      <div className="card-surface p-5 md:p-6 space-y-4">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-base md:text-lg text-foreground leading-tight">
                {entry.role}
              </h3>
              {entry.companyUrl ? (
                <a
                  href={entry.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  {entry.company}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="M7 7h10v10M7 17 17 7" />
                  </svg>
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">{entry.company}</p>
              )}
            </div>
            <span className="text-xs text-muted-foreground font-medium shrink-0 tabular-nums">
              {startLabel} — {endLabel}
            </span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 pt-0.5">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {entry.location}
            </span>
            {entry.remote && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect width="20" height="14" x="2" y="3" rx="2" />
                  <path d="M8 21h8m-4-4v4" />
                </svg>
                {locale === "es" ? "Remoto" : "Remote"}
              </span>
            )}
          </div>
        </div>

        {/* Highlights */}
        <ul className="space-y-2" role="list">
          {entry.highlights.map((h, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed"
            >
              <span
                aria-hidden
                className="mt-[5px] size-1.5 rounded-full bg-muted-foreground/40 shrink-0"
              />
              {h}
            </li>
          ))}
        </ul>

        {/* Tech tags (collapsed behind a count badge) */}
        {entry.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setShowTech((v) => !v)}
              aria-expanded={showTech}
              className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium inline-flex items-center gap-1 hover:text-foreground transition-colors cursor-pointer"
            >
              {entry.technologies.length} skills
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className={cn(
                  "transition-transform",
                  showTech && "rotate-180",
                )}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {showTech &&
              entry.technologies.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium"
                >
                  {tech}
                </span>
              ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function ExperienceSection({ data, locale }: ExperienceSectionProps) {
  const entries = data.filter(
    (entry) => entry.id && entry.role?.trim() && entry.company?.trim(),
  );
  const isEmpty = entries.length === 0;

  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="section-spacing w-full"
    >
      <div className="glass-card glass-card-bleed w-full">
        <div className="container-page py-12 md:py-16">
          <SectionHeader
            id="experience-heading"
            label={locale === "es" ? "Experiencia" : "Experience"}
            heading={locale === "es" ? "Trayectoria profesional" : "Work History"}
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="mt-12 space-y-6 max-w-3xl"
          >
            {isEmpty ? (
              <motion.p
                variants={fadeUp}
                className="text-base text-muted-foreground leading-relaxed"
              >
                {locale === "es"
                  ? "Aún no hay trayectoria profesional registrada."
                  : "No work history has been added yet."}
              </motion.p>
            ) : (
              entries.map((entry, i) => (
                <ExperienceCard
                  key={entry.id}
                  entry={entry}
                  locale={locale}
                  isLast={i === entries.length - 1}
                />
              ))
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
