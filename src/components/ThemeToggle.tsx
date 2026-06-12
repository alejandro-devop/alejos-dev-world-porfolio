"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

const TRACK_W = 52;
const TRACK_H = 30;
const THUMB = 24;
const PADDING = 3;
const TRAVEL = TRACK_W - PADDING * 2 - THUMB;

const spring = { type: "spring" as const, stiffness: 520, damping: 38, mass: 0.75 };
const instant = { duration: 0 };

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      className={className}
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/**
 * Apple-style light / dark switch with spring thumb and icon crossfade.
 * Renders a size-matched placeholder until hydrated to avoid SSR mismatch.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <span
        className={cn("inline-block shrink-0 rounded-full", className)}
        style={{ width: TRACK_W, height: TRACK_H }}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const transition = reduceMotion ? instant : spring;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative inline-flex shrink-0 touch-manipulation rounded-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      style={{ width: TRACK_W, height: TRACK_H }}
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        animate={{
          backgroundColor: isDark
            ? "oklch(0.34 0.07 265)"
            : "oklch(0.90 0.04 250)",
          boxShadow: isDark
            ? "inset 0 1px 0 oklch(1 0 0 / 8%), inset 0 -1px 2px oklch(0 0 0 / 25%)"
            : "inset 0 1px 0 oklch(1 0 0 / 55%), inset 0 -1px 2px oklch(0.45 0.06 255 / 12%)",
        }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.4, 0, 0.2, 1] }}
        aria-hidden
      />

      {/* Track icons — visible in the uncovered side */}
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-between px-2"
        aria-hidden
      >
        <SunIcon
          className={cn(
            "transition-opacity duration-300",
            isDark ? "text-amber-300/90 opacity-100" : "opacity-0",
          )}
        />
        <MoonIcon
          className={cn(
            "transition-opacity duration-300",
            isDark ? "opacity-0" : "text-indigo-400/80 opacity-100",
          )}
        />
      </span>

      {/* Thumb */}
      <motion.span
        className={cn(
          "absolute top-[3px] left-[3px] z-10 flex items-center justify-center rounded-full",
          "bg-white text-amber-500 shadow-[0_1px_4px_oklch(0_0_0/18%),0_0_0_0.5px_oklch(0_0_0/6%)]",
          "dark:bg-oklch(0.97_0_0) dark:text-indigo-400",
        )}
        style={{ width: THUMB, height: THUMB }}
        animate={{ x: isDark ? TRAVEL : 0 }}
        transition={transition}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={reduceMotion ? false : { opacity: 0, rotate: -40, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, rotate: 40, scale: 0.6 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-center"
            >
              <MoonIcon />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={reduceMotion ? false : { opacity: 0, rotate: 40, scale: 0.6 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, rotate: -40, scale: 0.6 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center justify-center"
            >
              <SunIcon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
}
