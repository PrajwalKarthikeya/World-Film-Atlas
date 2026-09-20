import { MetricSwitcher } from "@/components/metric-switcher";
import { CountrySearch } from "@/components/country-search";

export function AtlasHeader() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 p-3 sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="pointer-events-auto max-w-xl">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            World cinema
          </p>
          <h1 className="font-display text-3xl leading-none font-medium tracking-[-0.03em] text-fg sm:text-4xl">
            Box Office Atlas
          </h1>
        </div>
        <div className="pointer-events-auto flex items-center gap-2 lg:max-w-xl lg:flex-1">
          <div className="min-w-0 flex-1">
            <MetricSwitcher />
          </div>
          <CountrySearch />
        </div>
      </div>
    </header>
  );
}
