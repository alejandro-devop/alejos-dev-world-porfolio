"use client";

import { motion } from "framer-motion";
import { fadeUp, defaultViewport } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  id?: string;
  /** Eyebrow label above the heading; omit when it would repeat the heading. */
  label?: string;
  heading: string;
  description?: string;
  className?: string;
  /** Center-align the text (default: left) */
  centered?: boolean;
}

/**
 * Reusable animated section header.
 * Shows an eyebrow label, main heading, and optional description.
 */
export function SectionHeader({
  id,
  label,
  heading,
  description,
  className,
  centered = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={defaultViewport}
      className={cn(centered ? "text-center" : "", className)}
    >
      {label && (
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          {label}
        </p>
      )}
      <h2 id={id} className="font-bold text-foreground">
        {heading}
      </h2>
      {description && (
        <p className="mt-4 text-base text-muted-foreground max-w-2xl">
          {description}
        </p>
      )}
    </motion.div>
  );
}
