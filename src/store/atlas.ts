import { create } from "zustand";
import type { MetricId } from "@/data/types";
import { DEFAULT_METRIC } from "@/data/metrics";

export const DEFAULT_CENTER: [number, number] = [15, 10];
export const DEFAULT_ZOOM = 1.12;

interface AtlasState {
  metric: MetricId;
  selectedIso: string | null;
  hoveredIso: string | null;
  center: [number, number];
  zoom: number;
  searchOpen: boolean;
  setMetric: (metric: MetricId) => void;
  selectCountry: (iso: string | null) => void;
  hoverCountry: (iso: string | null) => void;
  setView: (view: { center: [number, number]; zoom: number }) => void;
  resetView: () => void;
  setSearchOpen: (open: boolean) => void;
}

export const useAtlas = create<AtlasState>((set) => ({
  metric: DEFAULT_METRIC,
  selectedIso: null,
  hoveredIso: null,
  center: DEFAULT_CENTER,
  zoom: DEFAULT_ZOOM,
  searchOpen: false,
  setMetric: (metric) => set({ metric }),
  selectCountry: (selectedIso) => set({ selectedIso }),
  hoverCountry: (hoveredIso) => set({ hoveredIso }),
  setView: ({ center, zoom }) => set({ center, zoom }),
  resetView: () =>
    set({
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      selectedIso: null,
      hoveredIso: null,
    }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
}));
