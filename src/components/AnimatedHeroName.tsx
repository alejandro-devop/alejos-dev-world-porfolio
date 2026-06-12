"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { defaultViewport } from "@/lib/motion";

const TYPING_INTERVAL_MS = 78;
const TYPING_DELAY_AFTER_AVATAR_MS = 3_000;
const GLOW_INTERVAL_MS = 90;
const GLOW_CYCLE_MS = 10_000;

interface AnimatedHeroNameProps {
  name: string;
  canStart?: boolean;
}

export function AnimatedHeroName({ name, canStart = true }: AnimatedHeroNameProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <h1 className="font-bold tracking-tight" aria-label={name}>
        {name}
      </h1>
    );
  }

  return (
    <AnimatedHeroNameInner name={name} canStart={canStart} />
  );
}

function AnimatedHeroNameInner({ name, canStart }: AnimatedHeroNameProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, defaultViewport);
  const progressRef = useRef({ visibleCount: 0, typingComplete: false });

  const chars = Array.from(name);
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCursor, setShowCursor] = useState(false);
  const [glowIndex, setGlowIndex] = useState(-1);

  useEffect(() => {
    progressRef.current.visibleCount = visibleCount;
    progressRef.current.typingComplete = isTypingComplete;
  }, [visibleCount, isTypingComplete]);

  useEffect(() => {
    if (!isInView || !canStart) return;

    let typingTimer: number | undefined;

    const delayTimer = window.setTimeout(() => {
      const { visibleCount: current, typingComplete } = progressRef.current;

      if (typingComplete || current >= chars.length) {
        if (!typingComplete) {
          setShowCursor(true);
          setVisibleCount(chars.length);
          setIsTypingComplete(true);
        }
        return;
      }

      setShowCursor(true);

      if (current === 0) {
        setVisibleCount(1);
        progressRef.current.visibleCount = 1;
      }

      let index = Math.max(progressRef.current.visibleCount, 1);

      typingTimer = window.setInterval(() => {
        index += 1;
        progressRef.current.visibleCount = index;
        setVisibleCount(index);

        if (index >= chars.length) {
          if (typingTimer) window.clearInterval(typingTimer);
          progressRef.current.typingComplete = true;
          setIsTypingComplete(true);
        }
      }, TYPING_INTERVAL_MS);
    }, TYPING_DELAY_AFTER_AVATAR_MS);

    return () => {
      window.clearTimeout(delayTimer);
      if (typingTimer) window.clearInterval(typingTimer);
    };
  }, [isInView, canStart, chars.length]);

  useEffect(() => {
    if (!isInView || !isTypingComplete) return;

    let charTimer: number | undefined;
    let resetTimer: number | undefined;

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

    runGlowWave();
    const cycleTimer = window.setInterval(runGlowWave, GLOW_CYCLE_MS);

    return () => {
      window.clearInterval(cycleTimer);
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
