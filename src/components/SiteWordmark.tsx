import { cn } from "@/lib/utils";

interface SiteWordmarkProps {
  className?: string;
}

export function SiteWordmark({ className }: SiteWordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-0.5 text-[22px] tracking-tight",
        className,
      )}
    >
      <span className="font-semibold text-foreground">Alejo</span>
      <span className="brand-wordmark-dev">Dev</span>
    </span>
  );
}
