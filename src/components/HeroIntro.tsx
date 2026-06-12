"use client";

import { useState } from "react";
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
  const [avatarDone, setAvatarDone] = useState(false);

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

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.p
        variants={fadeUp}
        className="text-lg sm:text-xl text-muted-foreground font-medium"
      >
        {greeting}
      </motion.p>
      <HeroAvatar alt={name} onGrowComplete={() => setAvatarDone(true)} />
      <AnimatedHeroName key={name} name={name} canStart={avatarDone} />
    </div>
  );
}
