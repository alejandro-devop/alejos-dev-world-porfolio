"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

const TYPING_INTERVAL_MS = 42;
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
  const isInView = useInView(ref, { once: true, margin: "-80px 0px" });

  const chars = Array.from(name);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [glowIndex, setGlowIndex] = useState(-1);

  useEffect(() => {
    if (!isInView) return;

    let typingTimer: ReturnType<typeof setInterval> | undefined;

    const startTimer = window.setTimeout(() => {
      setShowCursor(true);
      setVisibleCount(1);

      let index = 1;
      typingTimer = window.setInterval(() => {
        index += 1;
        setVisibleCount(index);

        if (index >= chars.length) {
          if (typingTimer) window.clearInterval(typingTimer);
          typingTimer = undefined;
          setIsTypingComplete(true);
        }
      }, TYPING_INTERVAL_MS);
    }, 0);

    return () => {
      window.clearTimeout(startTimer);
      if (typingTimer) window.clearInterval(typingTimer);
    };
  }, [isInView, chars.length]);

  useEffect(() => {
    if (!isTypingComplete) return;

    let charTimer: ReturnType<typeof setInterval> | undefined;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    let cycleTimer: ReturnType<typeof setInterval> | undefined;

    const runGlowWave = () => {
      if (charTimer) window.clearInterval(charTimer);
      if (resetTimer) window.clearTimeout(resetTimer);

      let index = 0;
      setGlowIndex(0);

      charTimer = window.setInterval(() => {
        index += 1;
        if (index >= chars.length) {
          window.clearInterval(charTimer);
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
  }, [isTypingComplete, chars.length]);

  return (
    <h1 ref={ref} className="font-bold tracking-tight" aria-label={name}>
      <span aria-hidden>
        {chars.slice(0, visibleCount).map((char, index) => (
          <span
            key={`${index}-${char}`}
            className={cn(
              "inline transition-[color,text-shadow] duration-100",
              glowIndex === index && "hero-name-glow",
            )}
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
        {showCursor && <span className="hero-name-cursor" aria-hidden />}
      </span>
    </h1>
  );
}
