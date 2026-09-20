import { METRICS } from "@/data/metrics";
import type { MetricId } from "@/data/types";
import { cn } from "@/lib/utils";
import { useAtlas } from "@/store/atlas";

export function MetricSwitcher() {
  const metric = useAtlas((state) => state.metric);
  const setMetric = useAtlas((state) => state.setMetric);

  return (
    <div
      role="tablist"
      aria-label="Map metric"
      className="flex rounded-[var(--radius-md)] bg-surface-2 p-1 shadow-[var(--shadow-border)]"
    >
      {METRICS.map((item) => {
        const active = item.id === metric;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            className={cn(
              "metric-pill relative min-h-11 flex-1 rounded-[var(--radius-sm)] px-2.5 text-xs font-medium sm:text-sm",
              "transition-[color,background-color] duration-[var(--motion-fast)] ease-[var(--ease-smooth-out)]",
              active ? "bg-surface text-fg shadow-[var(--shadow-border)]" : "text-muted hover:text-fg",
            )}
            onClick={() => setMetric(item.id as MetricId)}
          >
            {item.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
