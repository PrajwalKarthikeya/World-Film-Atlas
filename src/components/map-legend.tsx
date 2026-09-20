import { METRICS } from "@/data/metrics";
import { legendGradient } from "@/lib/color-scale";
import { formatAdmissions, formatNumber, formatUSD } from "@/lib/format";
import { useMetricScale } from "@/hooks/use-metric-scale";
import { cn } from "@/lib/utils";
import { useAtlas } from "@/store/atlas";

function formatTick(value: number, metric: string): string {
  if (metric === "filmGross") return formatUSD(value);
  if (metric === "admissions") return formatAdmissions(value);
  return formatNumber(value);
}

export function MapLegend() {
  const { metric, ticks } = useMetricScale();
  const selectedIso = useAtlas((state) => state.selectedIso);
  const def = METRICS.find((item) => item.id === metric);

  return (
    <div
      className={cn(
        "pointer-events-none absolute bottom-20 left-3 z-10 w-44 rounded-[var(--radius-lg)] bg-surface/90 p-3 shadow-[var(--shadow-panel)] sm:bottom-6 sm:left-5 sm:w-48",
        selectedIso && "max-md:hidden",
      )}
    >
      <p className="text-xs font-medium tracking-wide text-muted uppercase">
        {def?.label}
      </p>
      <div className="mt-3 flex items-stretch gap-3">
        <div
          className="h-28 w-2.5 rounded-full shadow-[var(--shadow-border)]"
          style={{ background: legendGradient() }}
          aria-hidden="true"
        />
        <div className="flex flex-col justify-between py-0.5">
          {[...ticks].reverse().map((tick) => (
            <p key={tick} className="font-mono text-xs text-fg tabular-nums">
              {formatTick(tick, metric)}
            </p>
          ))}
        </div>
      </div>
      <p className="mt-3 text-xs leading-snug text-subtle">{def?.unit}</p>
      <p className="mt-2 text-xs leading-snug text-subtle">
        Log scale. Sample figures, rounded.
      </p>
    </div>
  );
}
