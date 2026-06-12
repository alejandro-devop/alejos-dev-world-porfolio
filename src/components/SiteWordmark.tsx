import { cn } from "@/lib/utils";

interface SiteWordmarkProps {
  className?: string;
}

export function SiteWordmark({ className }: SiteWordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline gap-1.5 text-[18px] font-semibold tracking-tight",
        className,
      )}
    >
      <span className="text-foreground">Alejo</span>
      <span className="brand-wordmark-dev">Dev</span>
    </span>
  );
}
