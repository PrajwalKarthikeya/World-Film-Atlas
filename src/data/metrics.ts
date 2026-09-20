import type { MetricDef } from "./types";

export const METRICS: MetricDef[] = [
  {
    id: "filmGross",
    label: "Top film gross",
    shortLabel: "Top film",
    description: "Worldwide box office of the country’s highest-grossing film",
    unit: "USD worldwide",
  },
  {
    id: "screens",
    label: "Cinema screens",
    shortLabel: "Screens",
    description: "Estimated cinema screens in the country",
    unit: "screens",
  },
  {
    id: "admissions",
    label: "Admissions",
    shortLabel: "Tickets",
    description: "Annual cinema admissions (tickets sold)",
    unit: "tickets / year",
  },
  {
    id: "productions",
    label: "Films produced",
    shortLabel: "Produced",
    description: "Feature films produced in a recent year",
    unit: "features / year",
  },
];

export const DEFAULT_METRIC = METRICS[0]!.id;
