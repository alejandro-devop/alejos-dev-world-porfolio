"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, defaultViewport } from "@/lib/motion";
import type { TestimonialsData, Testimonial } from "@/types/content";
import type { Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

function Avatar({ name, src }: { name: string; src?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className="size-10 rounded-full object-cover bg-muted" />;
  }
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className="size-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-muted-foreground select-none shrink-0">
      {initials}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <motion.article
      variants={fadeUp}
      className="card-surface flex flex-col gap-5 p-5 md:p-6 h-full"
    >
      {/* Quote mark */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        fill="currentColor"
        className="text-border"
        aria-hidden
      >
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>

      <blockquote className="flex-1 text-sm md:text-base text-muted-foreground leading-relaxed">
        "{t.quote}"
      </blockquote>

      <footer className="flex items-center gap-3">
        <Avatar name={t.authorName} src={t.authorAvatarUrl} />
        <div>
          <p className="text-sm font-semibold text-foreground leading-tight">
            {t.authorName}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.authorRole} · {t.authorCompany}
          </p>
        </div>
      </footer>
    </motion.article>
  );
}

interface TestimonialsSectionProps {
  data: TestimonialsData;
  locale: Locale;
}

export function TestimonialsSection({ data, locale }: TestimonialsSectionProps) {
  const featured = data.filter((t) => t.featured);
  const shown = featured.length > 0 ? featured : data;

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="section-spacing container-page"
    >
      <SectionHeader
        id="testimonials-heading"
        label={locale === "es" ? "Testimonios" : "Testimonials"}
        heading={locale === "es" ? "Lo que dicen de mí" : "What people say"}
        centered
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {shown.map((t) => (
          <TestimonialCard key={t.id} t={t} />
        ))}
      </motion.div>
    </section>
  );
}
