"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { stagger, defaultViewport } from "@/lib/motion";
import type { Locale } from "@/config/i18n";
import { cn } from "@/lib/utils";

interface CarouselProps {
  locale: Locale;
  /** Width classes applied to every slide (controls how many are visible). */
  itemClassName: string;
  className?: string;
  children: React.ReactNode[];
}

const ARROW = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export function Carousel({
  locale,
  itemClassName,
  className,
  children,
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, children.length]);

  const scrollByDir = (dir: -1 | 1) => {
    const el = trackRef.current;
    el?.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  // Autoplay: advance every 20s, wrapping to the start; paused while hovered.
  useEffect(() => {
    const id = setInterval(() => {
      const el = trackRef.current;
      if (!el || hoverRef.current) return;
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      if (el.scrollLeft >= max - 4) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: el.clientWidth * 0.9, behavior: "smooth" });
      }
    }, 20_000);
    return () => clearInterval(id);
  }, []);

  const scrollable = canPrev || canNext;

  return (
    <div
      className={className}
      onMouseEnter={() => {
        hoverRef.current = true;
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
      }}
    >
      <motion.div
        ref={trackRef}
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={defaultViewport}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory no-scrollbar"
      >
        {children.map((child, i) => (
          <div key={i} className={cn("snap-start shrink-0", itemClassName)}>
            {child}
          </div>
        ))}
      </motion.div>

      {scrollable && (
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            disabled={!canPrev}
            aria-label={locale === "es" ? "Anterior" : "Previous"}
            className="size-9 rounded-full border border-border bg-card text-foreground flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30 disabled:pointer-events-none"
          >
            <span className="rotate-180">{ARROW}</span>
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            disabled={!canNext}
            aria-label={locale === "es" ? "Siguiente" : "Next"}
            className="size-9 rounded-full border border-border bg-card text-foreground flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30 disabled:pointer-events-none"
          >
            {ARROW}
          </button>
        </div>
      )}
    </div>
  );
}
