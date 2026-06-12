"use client";

import { useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HeroAvatarProps {
  alt: string;
  className?: string;
  onGrowComplete?: () => void;
}

export function HeroAvatar({ alt, className, onGrowComplete }: HeroAvatarProps) {
  useEffect(() => {
    onGrowComplete?.();
  }, [onGrowComplete]);

  return (
    <div
      className={cn(
        "hero-avatar relative size-[150px] md:size-[200px] shrink-0 overflow-hidden rounded-full bg-black shadow-lg",
        className,
      )}
    >
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
