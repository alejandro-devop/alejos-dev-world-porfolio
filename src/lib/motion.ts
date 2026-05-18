/**
 * lib/motion.ts
 *
 * Reusable Framer Motion variants and helpers.
 * Import these instead of defining animations inline to keep components clean
 * and animations consistent across the site.
 *
 * Usage:
 *   import { fadeUp, stagger } from "@/lib/motion";
 *   <motion.div variants={fadeUp} initial="hidden" animate="visible" />
 */

import type { Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Core variants
// ---------------------------------------------------------------------------

/** Fade in while rising 24px. Standard for most reveals. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

/** Fade in only (no movement). Good for overlays, images. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

/** Slide in from the left. Useful for mobile drawers. */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    x: -24,
    transition: { duration: 0.25, ease: [0.4, 0, 1, 1] },
  },
};

/** Stagger children — wrap in a `motion.div` with these variants. */
export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Scale in from 95% — card hover lift or modal entrance. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.34, 1.56, 0.64, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  },
};

// ---------------------------------------------------------------------------
// Page transition
// ---------------------------------------------------------------------------

/** Fade only — locale / language switches (no vertical shift). */
export const localeTransition: Variants = {
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
  },
  hidden: {
    opacity: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] },
  },
};

/** Wraps entire page content for route-change transitions. */
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  },
};

// ---------------------------------------------------------------------------
// Viewport helpers — use with whileInView
// ---------------------------------------------------------------------------

/** Default viewport options for scroll-triggered animations. */
export const defaultViewport = { once: true, margin: "-80px 0px" } as const;
