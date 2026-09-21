export type Region =
  | "Africa"
  | "Asia"
  | "Europe"
  | "Americas"
  | "Oceania"
  | "Middle East";

export type MetricId = "filmGross" | "screens" | "admissions" | "productions";

export interface Film {
  title: string;
  originalTitle?: string;
  year: number;
  director: string;
  studio: string;
  language: string;
  genre: string;
  worldwideGross: number;
  synopsis: string;
}

export interface CountryRecord {
  iso: string;
  isoA3: string;
  name: string;
  region: Region;
  screens: number;
  admissions: number;
  productions: number;
  film: Film;
}

export interface MetricDef {
  id: MetricId;
  label: string;
  shortLabel: string;
  description: string;
  unit: string;
}
