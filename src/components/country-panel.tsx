import { X } from "lucide-react";
import { COUNTRIES, COUNTRY_BY_ISO } from "@/data/countries";
import { METRICS } from "@/data/metrics";
import { FilmPoster } from "@/components/film-poster";
import { Button } from "@/components/ui/button";
import { formatAdmissions, formatMetric, formatNumber, formatUSD, metricValue } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useMetricScale } from "@/hooks/use-metric-scale";
import { useAtlas } from "@/store/atlas";

export function CountryPanel() {
  const selectedIso = useAtlas((state) => state.selectedIso);
  const selectCountry = useAtlas((state) => state.selectCountry);
  const metric = useAtlas((state) => state.metric);
  const { colorOf } = useMetricScale();
  const country = selectedIso ? COUNTRY_BY_ISO[selectedIso] : undefined;
  const def = METRICS.find((item) => item.id === metric);

  const leaders = [...COUNTRIES]
    .sort((a, b) => metricValue(b, metric) - metricValue(a, metric))
    .slice(0, 8);

  return (
    <>
      {!country ? (
        <div className="atlas-hint pointer-events-none absolute inset-x-3 bottom-3 z-20 rounded-[var(--radius-lg)] bg-surface/90 px-4 py-3 text-center shadow-[var(--shadow-panel)] md:hidden">
          <p className="text-sm text-fg">Tap a country to see its highest-grossing film</p>
        </div>
      ) : null}

      <aside
        className={cn(
          "atlas-panel fixed z-20 flex flex-col overflow-hidden bg-surface shadow-[var(--shadow-panel)]",
          "inset-x-3 bottom-3 max-h-[72vh] rounded-[var(--radius-xl)]",
          "md:inset-y-20 md:right-4 md:bottom-4 md:left-auto md:w-96 md:max-h-none",
          country
            ? "translate-y-0 opacity-100"
            : "max-md:pointer-events-none max-md:translate-y-4 max-md:opacity-0",
        )}
        style={{
          transition:
            "opacity var(--motion-slow) var(--ease-smooth-out), transform var(--motion-slow) var(--ease-smooth-out)",
        }}
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted uppercase">
              {country ? country.region : def?.label}
            </p>
            <h2 className="font-display mt-1 text-2xl leading-tight font-medium tracking-[-0.03em]">
              {country ? country.name : "Select a country"}
            </h2>
          </div>
          {country ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Close country details"
              onClick={() => selectCountry(null)}
            >
              <X />
            </Button>
          ) : null}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          {country ? (
            <div className="space-y-5">
              <p className="text-sm text-muted">Highest-grossing film</p>
              <FilmPoster country={country} color={colorOf(metricValue(country, metric))} />
              <dl className="grid grid-cols-2 gap-3">
                <Stat label="Worldwide" value={formatUSD(country.film.worldwideGross)} />
                <Stat label="Language" value={country.film.language} />
                <Stat label="Studio" value={country.film.studio} />
                <Stat label="Director" value={country.film.director} />
              </dl>
              <p className="text-sm leading-relaxed text-muted">{country.film.synopsis}</p>
              <div className="grid grid-cols-3 gap-2 rounded-[var(--radius-md)] bg-surface-2 p-3 shadow-[var(--shadow-border)]">
                <MiniStat label="Screens" value={formatNumber(country.screens)} />
                <MiniStat label="Tickets" value={formatAdmissions(country.admissions)} />
                <MiniStat label="Produced" value={formatNumber(country.productions)} />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-muted">
                Color the world by box office, screens, tickets, or films made. Click any
                country for the picture that put it on the map.
              </p>
              <p className="text-xs font-medium tracking-wide text-muted uppercase">
                Leaders · {def?.shortLabel}
              </p>
              <ol className="space-y-1">
                {leaders.map((item, index) => (
                  <li key={item.iso}>
                    <button
                      type="button"
                      className="flex min-h-11 w-full items-center gap-3 rounded-[var(--radius-sm)] px-2 text-left hover:bg-surface-2"
                      onClick={() => selectCountry(item.iso)}
                    >
                      <span className="w-5 font-mono text-xs text-subtle tabular-nums">
                        {index + 1}
                      </span>
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ background: colorOf(metricValue(item, metric)) }}
                        aria-hidden="true"
                      />
                      <span className="flex-1 truncate text-sm text-fg">{item.name}</span>
                      <span className="font-mono text-xs text-muted tabular-nums">
                        {formatMetric(item, metric)}
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-sm)] bg-surface-2 px-3 py-2.5 shadow-[var(--shadow-border)]">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className="mt-0.5 text-sm leading-snug text-fg">{value}</dd>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-subtle">{label}</p>
      <p className="mt-0.5 font-mono text-sm text-fg tabular-nums">{value}</p>
    </div>
  );
}
