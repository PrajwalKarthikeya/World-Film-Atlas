import { useMemo } from "react";
import { COUNTRIES } from "@/data/countries";
import { makeColorScale, scaleTicks } from "@/lib/color-scale";
import { metricValue } from "@/lib/format";
import { useAtlas } from "@/store/atlas";

export function useMetricScale() {
  const metric = useAtlas((state) => state.metric);

  return useMemo(() => {
    const values = COUNTRIES.map((country) => metricValue(country, metric));
    const positive = values.filter((value) => value > 0);
    const min = positive.length ? Math.min(...positive) : 1;
    const max = positive.length ? Math.max(...positive) : 1;
    return {
      metric,
      colorOf: makeColorScale(values),
      min,
      max,
      ticks: scaleTicks(min, max),
    };
  }, [metric]);
}
