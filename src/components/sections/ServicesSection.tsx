"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, scaleIn, defaultViewport } from "@/lib/motion";
import type { ServicesData, Service } from "@/types/content";
import type { Locale } from "@/config/i18n";
import { SectionHeader } from "@/components/ui/SectionHeader";

// Inline SVG map — avoids an icon library dependency.
const ICONS: Record<string, React.ReactNode> = {
  code: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  layout: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  ),
  lightbulb: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6m-5 4h4" />
    </svg>
  ),
  users: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

function hasText(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

function isValidService(service: Service): boolean {
  return (
    hasText(service.id) &&
    hasText(service.title) &&
    hasText(service.description)
  );
}

function ServiceCard({ service }: { service: Service }) {
  const iconKey = hasText(service.icon) ? service.icon.trim() : "code";
  const icon = ICONS[iconKey] ?? ICONS.code;
  const highlights = service.highlights?.filter(hasText) ?? [];

  return (
    <motion.article
      variants={scaleIn}
      className="card-surface flex flex-col gap-5 p-5 md:p-7 h-full"
    >
      <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-foreground shrink-0">
        {icon}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="font-semibold text-base text-foreground">
          {service.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {service.description}
        </p>
      </div>

      {highlights.length > 0 && (
        <ul className="space-y-2" role="list">
          {highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-2.5 text-sm text-muted-foreground"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-[2px] text-foreground/50 shrink-0"
                aria-hidden
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {h}
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}

interface ServicesSectionProps {
  data: ServicesData;
  locale: Locale;
}

export function ServicesSection({ data, locale }: ServicesSectionProps) {
  const services = data.filter(isValidService);
  const isEmpty = services.length === 0;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-spacing w-full"
    >
      <div className="glass-card glass-card-bleed w-full">
        <div className="container-page py-12 md:py-16">
          <SectionHeader
            id="services-heading"
            label={locale === "es" ? "Servicios" : "Services"}
            heading={locale === "es" ? "¿En qué puedo ayudarte?" : "How I can help"}
            centered
          />

          {isEmpty ? (
            <motion.p
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="mt-12 text-base text-muted-foreground leading-relaxed text-center"
            >
              {locale === "es"
                ? "Aún no hay servicios registrados."
                : "No services have been added yet."}
            </motion.p>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5"
            >
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
