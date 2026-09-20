import type { CountryRecord } from "@/data/types";
import { formatUSD } from "@/lib/format";

interface FilmPosterProps {
  country: CountryRecord;
  color: string;
}

export function FilmPoster({ country, color }: FilmPosterProps) {
  const { film } = country;

  return (
    <div
      className="relative isolate flex aspect-poster flex-col justify-between overflow-hidden rounded-[var(--radius-md)] px-5 py-5 text-fg shadow-[var(--shadow-border)]"
      style={{
        background: `linear-gradient(165deg, color-mix(in oklab, ${color} 42%, #121417) 0%, #101214 58%, #0c0d10 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1"
        style={{ background: color }}
      />
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">
          {film.genre}
        </p>
        <p className="font-mono text-xs tabular-nums text-muted">{film.year}</p>
      </div>
      <div className="space-y-3">
        <h3 className="font-display text-2xl leading-tight font-medium tracking-[-0.03em] text-balance">
          {film.title}
        </h3>
        {film.originalTitle ? (
          <p className="text-sm text-muted">{film.originalTitle}</p>
        ) : null}
        <p className="text-sm text-muted">{film.director}</p>
        <p className="font-mono text-lg font-medium tracking-tight text-fg tabular-nums">
          {formatUSD(film.worldwideGross)}
        </p>
      </div>
    </div>
  );
}
