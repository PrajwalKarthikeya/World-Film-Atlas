import { scaleSequentialLog } from "d3-scale";
import { interpolateRgb, piecewise } from "d3-interpolate";

export const MAP_EMPTY = "#181a1d";
export const MAP_STOPS = [
  "#1a3038",
  "#21555f",
  "#3a7c82",
  "#5eaaa8",
  "#8ecfc4",
  "#d4efe6",
] as const;

const interpolator = piecewise(interpolateRgb, [...MAP_STOPS]);

export function legendGradient(): string {
  return `linear-gradient(180deg, ${[...MAP_STOPS].reverse().join(", ")})`;
}

export function makeColorScale(values: number[]): (value: number | undefined) => string {
  const positive = values.filter((value) => value > 0 && Number.isFinite(value));
  if (positive.length === 0) {
    return () => MAP_EMPTY;
  }
  const min = Math.min(...positive);
  const max = Math.max(...positive);
  const domainMin = min === max ? min * 0.5 || 0.1 : min;
  const scale = scaleSequentialLog(interpolator)
    .domain([Math.max(domainMin, 0.05), max])
    .clamp(true);

  return (value: number | undefined) => {
    if (value == null || value <= 0 || Number.isNaN(value)) return MAP_EMPTY;
    return scale(value);
  };
}

export function scaleTicks(min: number, max: number): number[] {
  if (!(max > 0) || !(min > 0)) return [max];
  if (max / min < 8) return [min, (min + max) / 2, max];
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  const mid = 10 ** ((logMin + logMax) / 2);
  return [min, mid, max];
}
