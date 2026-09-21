import type { CountryRecord, MetricId } from "@/data/types";

export function metricValue(country: CountryRecord, metric: MetricId): number {
  switch (metric) {
    case "filmGross":
      return country.film.worldwideGross;
    case "screens":
      return country.screens;
    case "admissions":
      return country.admissions;
    case "productions":
      return country.productions;
  }
}

export function formatUSD(value: number): string {
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `$${billions >= 10 ? billions.toFixed(1) : billions.toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `$${millions >= 100 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${Math.round(value)}`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

export function formatAdmissions(millions: number): string {
  if (millions >= 1000) {
    const billions = millions / 1000;
    return `${billions >= 10 ? billions.toFixed(1) : billions.toFixed(2)}B`;
  }
  if (millions >= 100) return `${millions.toFixed(0)}M`;
  if (millions >= 10) return `${millions.toFixed(1)}M`;
  if (millions >= 1) return `${millions.toFixed(1)}M`;
  return `${Math.round(millions * 1000)}K`;
}

export function formatMetric(country: CountryRecord, metric: MetricId): string {
  switch (metric) {
    case "filmGross":
      return formatUSD(country.film.worldwideGross);
    case "screens":
      return formatNumber(country.screens);
    case "admissions":
      return formatAdmissions(country.admissions);
    case "productions":
      return formatNumber(country.productions);
  }
}

export function formatYear(year: number): string {
  return String(year);
}
