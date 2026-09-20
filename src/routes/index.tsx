import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AtlasHeader } from "@/components/atlas-header";
import { CountryPanel } from "@/components/country-panel";
import { MapLegend } from "@/components/map-legend";
import { WorldMap } from "@/components/world-map";
import { ZoomControls } from "@/components/zoom-controls";
import { useAtlas } from "@/store/atlas";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const selectCountry = useAtlas((state) => state.selectCountry);
  const setSearchOpen = useAtlas((state) => state.setSearchOpen);
  const searchOpen = useAtlas((state) => state.searchOpen);
  const selectedIso = useAtlas((state) => state.selectedIso);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(!searchOpen);
        return;
      }
      if (event.key === "/" && !typing) {
        event.preventDefault();
        setSearchOpen(true);
        return;
      }
      if (event.key === "Escape") {
        if (searchOpen) {
          setSearchOpen(false);
          return;
        }
        if (selectedIso) selectCountry(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchOpen, selectedIso, selectCountry, setSearchOpen]);

  return (
    <main className="relative h-dvh overflow-hidden bg-bg text-fg">
      <WorldMap />
      <AtlasHeader />
      <MapLegend />
      <ZoomControls />
      <CountryPanel />
    </main>
  );
}
