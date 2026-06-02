"use client";

import { motion } from "framer-motion";
import { fadeUp, stagger, defaultViewport } from "@/lib/motion";
import type { HeroData } from "@/types/content";
import type { Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  data: HeroData;
  locale: Locale;
}

export function HeroSection({ data, locale }: HeroSectionProps) {
  return (
    <section
      id="hero"
      aria-label="Hero"
      className={cn(
        "relative flex flex-col items-center justify-center text-center",
        "min-h-[calc(100svh-var(--nav-height))]",
        "section-spacing container-page",
        "overflow-hidden",
      )}
    >
      {/* Subtle radial glow — decorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.85 0 0 / 20%), transparent)",
        }}
      />

      {/* Glass container — div plain para que backdrop-filter no interfiera con Framer Motion */}
      <div className="glass-card w-full px-8 py-20 sm:px-14 sm:py-28">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-5"
      >
        {/* Availability badge */}
        {data.availableForWork && (
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {data.availableForWorkLabel}
            </span>
          </motion.div>
        )}

        {/* Greeting + name */}
        <motion.div variants={fadeUp} className="space-y-1">
          <p className="text-base text-muted-foreground font-medium">
            {data.greeting}
          </p>
          <h1 className="font-bold tracking-tight">{data.name}</h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          variants={fadeUp}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-2xl"
        >
          {data.tagline}
        </motion.p>

        {/* Sub-tagline */}
        <motion.p
          variants={fadeUp}
          className="text-sm sm:text-base text-muted-foreground max-w-xl"
        >
          {data.subtagline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2"
        >
          <a
            href={data.cta.primary.url}
            className={cn(
              "inline-flex items-center justify-center",
              "rounded-full px-7 py-3 text-sm font-semibold",
              "bg-primary text-primary-foreground",
              "hover:opacity-85 active:scale-95 transition-all duration-150",
              "w-full sm:w-auto",
            )}
          >
            {data.cta.primary.label}
          </a>
          <a
            href={data.cta.secondary.url}
            className={cn(
              "inline-flex items-center justify-center",
              "rounded-full px-7 py-3 text-sm font-semibold",
              "border border-border bg-transparent",
              "hover:bg-accent active:scale-95 transition-all duration-150",
              "w-full sm:w-auto",
            )}
          >
            {data.cta.secondary.label}
          </a>
        </motion.div>
      </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-muted-foreground"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
