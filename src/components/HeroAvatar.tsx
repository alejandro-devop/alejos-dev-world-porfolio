"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { defaultViewport, growIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface HeroAvatarProps {
  alt: string;
  className?: string;
  onGrowComplete?: () => void;
}

export function HeroAvatar({ alt, className, onGrowComplete }: HeroAvatarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, defaultViewport);
  const prefersReducedMotion = useReducedMotion();
  const [growComplete, setGrowComplete] = useState(false);
  const notifiedRef = useRef(false);

  const notifyComplete = () => {
    if (notifiedRef.current) return;
    notifiedRef.current = true;
    setGrowComplete(true);
    onGrowComplete?.();
  };

  const shellClass = cn(
    "hero-avatar relative size-[150px] md:size-[200px] shrink-0 overflow-hidden rounded-full bg-black shadow-lg",
    className,
  );

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={shellClass}>
        <Image
          src="/mi-avatar.png"
          alt={alt}
          fill
          priority
          sizes="(max-width: 767px) 150px, 200px"
          className="object-cover object-[center_18%]"
        />
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={growIn}
      initial="hidden"
      animate={growComplete || isInView ? "visible" : "hidden"}
      onAnimationComplete={(definition) => {
        if (definition === "visible") notifyComplete();
      }}
      className={shellClass}
    >
      <Image
        src="/mi-avatar.png"
        alt={alt}
        fill
        priority
        sizes="(max-width: 767px) 150px, 200px"
        className="object-cover object-[center_18%]"
      />
    </motion.div>
  );
}
