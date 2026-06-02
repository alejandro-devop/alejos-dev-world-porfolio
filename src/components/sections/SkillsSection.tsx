"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, defaultViewport } from "@/lib/motion";
import type {
  SkillsData,
  SkillCategory,
  Skill,
  SkillLevel,
} from "@/types/content";
import type { Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface SkillsSectionProps {
  data: SkillsData;
  locale: Locale;
}

const LEVEL_DOTS: Record<SkillLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
  expert: 4,
};

function SkillPill({ skill }: { skill: Skill }) {
  const filled = LEVEL_DOTS[skill.level];
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3",
        "px-4 py-2.5 rounded-xl",
        "border border-border bg-surface",
        "hover:border-foreground/20 hover:bg-accent transition-colors duration-150",
      )}
    >
      <span className="text-sm font-medium text-foreground">{skill.name}</span>
      <span className="flex gap-1" aria-label={skill.level} title={skill.level}>
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "size-1.5 rounded-full transition-colors",
              i < filled ? "bg-foreground" : "bg-border",
            )}
          />
        ))}
      </span>
    </div>
  );
}

function CategoryBlock({ cat }: { cat: SkillCategory }) {
  return (
    <motion.div variants={fadeUp} className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {cat.category}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {cat.skills.map((skill) => (
          <SkillPill key={skill.name} skill={skill} />
        ))}
      </div>
    </motion.div>
  );
}

export function SkillsSection({ data, locale }: SkillsSectionProps) {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="section-spacing w-full"
    >
      <div className="glass-card glass-card-bleed w-full">
        <div className="container-page py-12 md:py-16">
          <SectionHeader
            id="skills-heading"
            label={locale === "es" ? "Habilidades" : "Skills"}
            heading={locale === "es" ? "Stack tecnológico" : "Tech Stack"}
            description={
              locale === "es"
                ? "Herramientas y tecnologías que uso en producción."
                : "Tools and technologies I use in production."
            }
          />

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12"
          >
            {data.map((cat) => (
              <CategoryBlock key={cat.category} cat={cat} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
