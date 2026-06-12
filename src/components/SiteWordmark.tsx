import { cn } from "@/lib/utils";

interface SiteWordmarkProps {
  className?: string;
}

export function SiteWordmark({ className }: SiteWordmarkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 overflow-visible text-[22px] leading-none tracking-tight",
        className,
      )}
    >
      <span className="inline-block font-semibold leading-none text-foreground">
        Alejo
      </span>
      <span className="brand-wordmark-dev">Dev</span>
    </span>
  );
}
