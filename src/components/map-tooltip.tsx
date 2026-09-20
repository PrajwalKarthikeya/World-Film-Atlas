import type { CountryRecord } from "@/data/types";
import { METRICS } from "@/data/metrics";
import { formatMetric } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useAtlas } from "@/store/atlas";

interface MapTooltipProps {
  country: CountryRecord | null;
  x: number;
  y: number;
  visible: boolean;
}

export function MapTooltip({ country, x, y, visible }: MapTooltipProps) {
  const metric = useAtlas((state) => state.metric);
  const def = METRICS.find((item) => item.id === metric);

  if (!visible || !country) return null;

  const flipX = x > (typeof window === "undefined" ? 0 : window.innerWidth - 260);
  const flipY = y > (typeof window === "undefined" ? 0 : window.innerHeight - 140);

  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none fixed z-40 w-56 rounded-[var(--radius-md)] bg-surface px-3 py-3 shadow-[var(--shadow-panel)]",
        "transition-opacity duration-[var(--motion-quick)] ease-[var(--ease-out)]",
      )}
      style={{
        left: x,
        top: y,
        transform: `translate(${flipX ? "-108%" : "14px"}, ${flipY ? "-110%" : "14px"})`,
      }}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {country.region}
      </p>
      <p className="mt-0.5 font-display text-lg leading-snug font-medium tracking-[-0.03em]">
        {country.name}
      </p>
      <p className="mt-2 font-mono text-sm text-fg tabular-nums">
        {formatMetric(country, metric)}
        <span className="ml-1.5 font-sans text-xs text-muted">{def?.shortLabel}</span>
      </p>
      <p className="mt-2 text-sm text-muted">
        {country.film.title}
        <span className="text-subtle"> · {country.film.year}</span>
      </p>
    </div>
  );
}
