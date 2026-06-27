"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProjectImage } from "@/types/content";

// ── Lightbox ──────────────────────────────────────────────────────────────────

function Lightbox({
  images,
  startIndex,
  onClose,
}: {
  images: ProjectImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);
  const [direction, setDirection] = useState(0);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0 }),
  };

  return (
    <div
      role="dialog"
      aria-modal
      aria-label="Image gallery"
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm font-medium tabular-nums">
        {index + 1} / {images.length}
      </div>

      {/* Image with swipe */}
      <div className="relative z-10 w-full max-w-4xl px-4 sm:px-12 flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) next();
              else if (info.offset.x > 50) prev();
            }}
            className="w-full cursor-grab active:cursor-grabbing select-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index].url}
              alt={`Image ${index + 1}`}
              draggable={false}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev / Next — hidden on mobile (swipe covers it) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="hidden sm:flex absolute left-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className="hidden sm:flex absolute right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                aria-label={`Go to image ${i + 1}`}
                className={cn(
                  "rounded-full transition-all",
                  i === index ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70",
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Gallery grid ──────────────────────────────────────────────────────────────

export function ProjectGallery({
  images,
  title,
}: {
  images: ProjectImage[];
  title: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [cover, ...rest] = images;

  return (
    <>
      <div className="space-y-3">
        {/* Cover — full width */}
        <button
          onClick={() => setLightboxIndex(0)}
          className="block w-full rounded-xl overflow-hidden focus-visible:ring-2 focus-visible:ring-ring group"
          aria-label={`Open gallery, image 1 of ${images.length}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover.url}
            alt={title}
            className="w-full object-cover max-h-[480px] bg-muted transition-transform duration-300 group-hover:scale-[1.01]"
          />
        </button>

        {/* Thumbnails grid */}
        {rest.length > 0 && (
          <div
            className={cn(
              "grid gap-3",
              rest.length === 1 && "grid-cols-1",
              rest.length === 2 && "grid-cols-2",
              rest.length >= 3 && "grid-cols-3",
            )}
          >
            {rest.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setLightboxIndex(i + 1)}
                className="block rounded-lg overflow-hidden focus-visible:ring-2 focus-visible:ring-ring group"
                aria-label={`Open gallery, image ${i + 2} of ${images.length}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={title}
                  className="w-full object-cover aspect-video bg-muted transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={images}
            startIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
