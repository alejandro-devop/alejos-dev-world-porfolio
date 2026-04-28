"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, fadeIn, defaultViewport } from "@/lib/motion";
import type { AboutData } from "@/types/content";
import type { Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface AboutSectionProps {
  data: AboutData;
  locale: Locale;
}

export function AboutSection({ data, locale }: AboutSectionProps) {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-spacing container-page"
    >
      <SectionHeader
        id="about-heading"
        label={locale === "es" ? "Sobre mí" : "About"}
        heading={data.headline}
      />

      <div className="mt-12 grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16 items-start">
        {/* Paragraphs */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="md:col-span-3 space-y-5"
        >
          {data.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              {p}
            </motion.p>
          ))}

          {/* Social links */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
            {data.socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-medium",
                  "text-muted-foreground hover:text-foreground",
                  "underline-offset-4 hover:underline transition-colors",
                )}
              >
                {link.label}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
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
                  <path d="M7 7h10v10M7 17 17 7" />
                </svg>
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Meta card */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          className="md:col-span-2"
        >
          <div className="card-surface p-6 space-y-5">
            <MetaRow
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
              value={data.location}
            />
            <MetaRow
              icon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              }
              value={data.email}
              href={`mailto:${data.email}`}
            />
            <div className="pt-1">
              <a
                href={data.resumeUrl}
                download
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2",
                  "rounded-xl border border-border px-5 py-3",
                  "text-sm font-medium text-foreground",
                  "hover:bg-accent transition-colors duration-150",
                )}
              >
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
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                {locale === "es" ? "Descargar CV" : "Download Resume"}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MetaRow({
  icon,
  value,
  href,
}: {
  icon: React.ReactNode;
  value: string;
  href?: string;
}) {
  const inner = (
    <span className="flex items-center gap-3">
      <span className="text-muted-foreground shrink-0">{icon}</span>
      <span className="text-sm text-muted-foreground truncate">{value}</span>
    </span>
  );
  return href ? (
    <a href={href} className="block hover:text-foreground transition-colors">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  );
}
