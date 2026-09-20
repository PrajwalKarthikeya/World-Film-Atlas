import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { COUNTRIES } from "@/data/countries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAtlas } from "@/store/atlas";

export function CountrySearch() {
  const open = useAtlas((state) => state.searchOpen);
  const setSearchOpen = useAtlas((state) => state.setSearchOpen);
  const selectCountry = useAtlas((state) => state.selectCountry);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const sorted = COUNTRIES.slice().sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return sorted.slice(0, 12);
    return sorted
      .filter((country) => {
        const haystack = [
          country.name,
          country.isoA3,
          country.film.title,
          country.film.originalTitle ?? "",
          country.region,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 16);
  }, [query]);

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        aria-label="Search countries"
        onClick={() => setSearchOpen(true)}
      >
        <Search />
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-bg/70 px-3 pt-20 md:pt-28">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Dismiss search"
            onClick={() => setSearchOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-[var(--radius-xl)] bg-surface p-3 shadow-[var(--shadow-panel)]">
            <div className="flex items-center gap-2 rounded-[var(--radius-md)] bg-surface-2 px-3 shadow-[var(--shadow-border)]">
              <Search className="size-4 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search countries or films"
                className="h-12 min-h-11 w-full bg-transparent text-sm text-fg outline-none placeholder:text-subtle"
                aria-label="Search countries or films"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <X />
              </Button>
            </div>
            <ul className="mt-2 max-h-80 overflow-y-auto">
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted">No matches</li>
              ) : (
                results.map((country) => (
                  <li key={country.iso}>
                    <button
                      type="button"
                      className={cn(
                        "flex min-h-12 w-full items-center justify-between gap-3 rounded-[var(--radius-sm)] px-3 text-left",
                        "hover:bg-surface-2",
                      )}
                      onClick={() => {
                        selectCountry(country.iso);
                        setSearchOpen(false);
                      }}
                    >
                      <span>
                        <span className="block text-sm text-fg">{country.name}</span>
                        <span className="block text-xs text-muted">
                          {country.film.title} · {country.film.year}
                        </span>
                      </span>
                      <span className="font-mono text-xs text-subtle">{country.isoA3}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
