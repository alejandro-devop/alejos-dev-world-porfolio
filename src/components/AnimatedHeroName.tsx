"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { defaultViewport } from "@/lib/motion";

const TYPING_INTERVAL_MS = 78;
// Small beat after hydration so the retype reads as intentional, not a glitch.
const TYPING_START_DELAY_MS = 350;
const GLOW_INTERVAL_MS = 90;
const GLOW_FIRST_DELAY_MS = 3_000;
const GLOW_CYCLE_MS = 10_000;

interface AnimatedHeroNameProps {
  name: string;
}

export function AnimatedHeroName({ name }: AnimatedHeroNameProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <h1 className="font-bold tracking-tight" aria-label={name}>
        {name}
      </h1>
    );
  }

  return <AnimatedHeroNameInner name={name} />;
}

function AnimatedHeroNameInner({ name }: AnimatedHeroNameProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, defaultViewport);
  const startedRef = useRef(false);

  const chars = Array.from(name);
  // The full name is visible from SSR (it's the page's H1 — it must never
  // depend on JS). The typewriter only kicks in after hydration, as an
  // enhancement layered on top.
  const [visibleCount, setVisibleCount] = useState(chars.length);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [glowIndex, setGlowIndex] = useState(-1);

  useEffect(() => {
    if (!isInView || startedRef.current) return;
    startedRef.current = true;

    let typingTimer: number | undefined;

    const startTimer = window.setTimeout(() => {
      setShowCursor(true);
      setVisibleCount(1);

      let index = 1;
      typingTimer = window.setInterval(() => {
        index += 1;
        setVisibleCount(index);

        if (index >= chars.length) {
          if (typingTimer) window.clearInterval(typingTimer);
          setIsTypingComplete(true);
        }
      }, TYPING_INTERVAL_MS);
    }, TYPING_START_DELAY_MS);

    return () => {
      window.clearTimeout(startTimer);
      if (typingTimer) window.clearInterval(typingTimer);
    };
  }, [isInView, chars.length]);

  useEffect(() => {
    if (!isInView || !isTypingComplete) return;

    let charTimer: number | undefined;
    let resetTimer: number | undefined;
    let cycleTimer: number | undefined;

    const runGlowWave = () => {
      if (charTimer) window.clearInterval(charTimer);
      if (resetTimer) window.clearTimeout(resetTimer);

      let index = 0;
      setGlowIndex(0);

      charTimer = window.setInterval(() => {
        index += 1;
        if (index >= chars.length) {
          if (charTimer) window.clearInterval(charTimer);
          charTimer = undefined;
          resetTimer = window.setTimeout(() => setGlowIndex(-1), GLOW_INTERVAL_MS);
        } else {
          setGlowIndex(index);
        }
      }, GLOW_INTERVAL_MS);
    };

    const firstGlowTimer = window.setTimeout(() => {
      runGlowWave();
      cycleTimer = window.setInterval(runGlowWave, GLOW_CYCLE_MS);
    }, GLOW_FIRST_DELAY_MS);

    return () => {
      window.clearTimeout(firstGlowTimer);
      if (cycleTimer) window.clearInterval(cycleTimer);
      if (charTimer) window.clearInterval(charTimer);
      if (resetTimer) window.clearTimeout(resetTimer);
    };
  }, [isInView, isTypingComplete, chars.length]);

  return (
    <h1 ref={ref} className="font-bold tracking-tight" aria-label={name}>
      <span aria-hidden>
        {chars.map((char, index) => (
          <span
            key={`${index}-${char}`}
            className={cn(
              index >= visibleCount && "invisible",
              "inline transition-[color,text-shadow] duration-100",
              isInView && glowIndex === index && "hero-name-glow",
            )}
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
        {showCursor && (
          <span
            className={cn("hero-name-cursor", !isInView && "hero-name-cursor--paused")}
            aria-hidden
          />
        )}
      </span>
    </h1>
  );
}
