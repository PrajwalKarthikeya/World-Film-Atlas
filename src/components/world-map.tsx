import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Graticule,
  Sphere,
  ZoomableGroup,
} from "react-simple-maps";
import type { Feature, Geometry } from "geojson";
import { geoArea, geoCentroid } from "d3-geo";
import {
  COUNTRY_BY_ISO,
  SKIP_GEO_IDS,
  countryFromGeography,
  geographyKey,
} from "@/data/countries";
import { metricValue } from "@/lib/format";
import { useMetricScale } from "@/hooks/use-metric-scale";
import { useAtlas } from "@/store/atlas";
import { MapTooltip } from "@/components/map-tooltip";

const GEO_URL = "/world-110m.json";
const MIN_ZOOM = 0.9;
const MAX_ZOOM = 10;

type MapFeature = Feature<Geometry> & { rsmKey: string };

function zoomForArea(area: number): number {
  if (area > 0.2) return 1.55;
  if (area > 0.08) return 2.15;
  if (area > 0.03) return 2.85;
  if (area > 0.01) return 3.7;
  if (area > 0.003) return 4.8;
  return 6.2;
}

function geoName(feature: Feature<Geometry>): string | undefined {
  const props = feature.properties as { name?: string } | null;
  return props?.name;
}

export function WorldMap() {
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState({
    x: 0,
    y: 0,
    visible: false,
    iso: null as string | null,
  });
  const geosRef = useRef<MapFeature[]>([]);
  const draggingRef = useRef(false);
  const lastSelectedRef = useRef<string | null>(null);

  const metric = useAtlas((state) => state.metric);
  const selectedIso = useAtlas((state) => state.selectedIso);
  const center = useAtlas((state) => state.center);
  const zoom = useAtlas((state) => state.zoom);
  const selectCountry = useAtlas((state) => state.selectCountry);
  const hoverCountry = useAtlas((state) => state.hoverCountry);
  const setView = useAtlas((state) => state.setView);
  const { colorOf } = useMetricScale();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selectedIso || selectedIso === lastSelectedRef.current) {
      lastSelectedRef.current = selectedIso;
      return;
    }
    lastSelectedRef.current = selectedIso;
    const geo = geosRef.current.find(
      (feature) => geographyKey(feature.id, geoName(feature)) === selectedIso,
    );
    if (!geo) return;
    const [lon, lat] = geoCentroid(geo);
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) return;
    setView({
      center: [lon, lat],
      zoom: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomForArea(geoArea(geo)))),
    });
  }, [selectedIso, setView]);

  const tooltipCountry = tooltip.iso ? COUNTRY_BY_ISO[tooltip.iso] : null;

  const fills = useMemo(() => {
    const map = new Map<string, string>();
    for (const country of Object.values(COUNTRY_BY_ISO)) {
      map.set(country.iso, colorOf(metricValue(country, metric)));
    }
    return map;
  }, [colorOf, metric]);

  if (!mounted) {
    return <div className="absolute inset-0 bg-map-ocean" aria-hidden="true" />;
  }

  return (
    <div className="absolute inset-0 bg-map-ocean">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 168 }}
        width={800}
        height={500}
        className="h-full w-full"
        aria-label="World map of cinema metrics"
      >
        <ZoomableGroup
          center={center}
          zoom={zoom}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onMove={({ dragging }) => {
            if (dragging) draggingRef.current = true;
          }}
          onMoveEnd={({ coordinates, zoom: nextZoom }) => {
            window.setTimeout(() => {
              draggingRef.current = false;
            }, 0);
            if (coordinates && nextZoom != null) {
              setView({ center: coordinates, zoom: nextZoom });
            }
          }}
        >
          <Sphere
            id="atlas-sphere"
            fill="var(--color-map-ocean)"
            stroke="var(--color-map-stroke)"
            strokeWidth={0.4}
            onClick={() => {
              if (!draggingRef.current) selectCountry(null);
            }}
          />
          <Graticule
            stroke="var(--color-map-stroke)"
            strokeWidth={0.3}
            step={[20, 20]}
          />
          <Geographies
            geography={GEO_URL}
            parseGeographies={(features) =>
              features.filter((feature) => {
                const id =
                  feature.id != null && String(feature.id).length > 0
                    ? String(feature.id).padStart(3, "0")
                    : "";
                return !SKIP_GEO_IDS.has(id);
              })
            }
          >
            {({ geographies }) => {
              geosRef.current = geographies;
              return geographies.map((geo) => {
                const name = geoName(geo);
                const key = geographyKey(geo.id, name);
                const country = countryFromGeography(geo.id, name);
                const selected = key === selectedIso;
                const fill = country
                  ? (fills.get(country.iso) ?? "var(--color-map-empty)")
                  : "var(--color-map-empty)";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    className="outline-none"
                    tabIndex={country ? 0 : -1}
                    role={country ? "button" : undefined}
                    aria-label={
                      country ? `${country.name}: ${country.film.title}` : name
                    }
                    data-selected={selected ? "true" : undefined}
                    data-empty={country ? undefined : "true"}
                    onMouseEnter={(event) => {
                      if (!country) return;
                      hoverCountry(key);
                      setTooltip({
                        x: event.clientX,
                        y: event.clientY,
                        visible: true,
                        iso: country.iso,
                      });
                    }}
                    onMouseMove={(event) => {
                      if (!country) return;
                      setTooltip((current) => ({
                        ...current,
                        x: event.clientX,
                        y: event.clientY,
                        visible: true,
                        iso: country.iso,
                      }));
                    }}
                    onMouseLeave={() => {
                      hoverCountry(null);
                      setTooltip((current) => ({ ...current, visible: false }));
                    }}
                    onFocus={() => {
                      if (country) hoverCountry(key);
                    }}
                    onBlur={() => hoverCountry(null)}
                    onClick={() => {
                      if (draggingRef.current || !country) return;
                      selectCountry(selected ? null : key);
                    }}
                    onKeyDown={(event) => {
                      if (!country) return;
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        selectCountry(selected ? null : key);
                      }
                    }}
                  />
                );
              });
            }}
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      <MapTooltip
        country={tooltipCountry ?? null}
        x={tooltip.x}
        y={tooltip.y}
        visible={tooltip.visible}
      />
    </div>
  );
}
