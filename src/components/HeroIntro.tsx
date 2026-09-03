"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { HeroAvatar } from "@/components/HeroAvatar";
import { AnimatedHeroName } from "@/components/AnimatedHeroName";

interface HeroIntroProps {
  greeting: string;
  name: string;
}

export function HeroIntro({ greeting, name }: HeroIntroProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg sm:text-xl text-muted-foreground font-medium">
          {greeting}
        </p>
        <HeroAvatar alt={name} />
        <h1 className="font-bold tracking-tight">{name}</h1>
      </div>
    );
  }

  // Avatar and name animate in parallel: the name no longer waits for the
  // avatar's grow animation, so a busy main thread can't hold the H1 hostage.
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.p
        variants={fadeUp}
        className="text-lg sm:text-xl text-muted-foreground font-medium"
      >
        {greeting}
      </motion.p>
      <HeroAvatar alt={name} />
      <AnimatedHeroName key={name} name={name} />
    </div>
  );
}
