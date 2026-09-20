import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_CENTER, DEFAULT_ZOOM, useAtlas } from "@/store/atlas";

const MIN_ZOOM = 0.9;
const MAX_ZOOM = 10;

export function ZoomControls() {
  const zoom = useAtlas((state) => state.zoom);
  const center = useAtlas((state) => state.center);
  const setView = useAtlas((state) => state.setView);
  const resetView = useAtlas((state) => state.resetView);
  const atDefault =
    zoom === DEFAULT_ZOOM &&
    center[0] === DEFAULT_CENTER[0] &&
    center[1] === DEFAULT_CENTER[1];

  return (
    <div className="absolute top-36 right-3 z-10 flex flex-col gap-1 lg:top-6 lg:right-[26.5rem]">
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        aria-label="Zoom in"
        onClick={() =>
          setView({ center, zoom: Math.min(MAX_ZOOM, zoom * 1.35) })
        }
      >
        <Plus />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        aria-label="Zoom out"
        onClick={() =>
          setView({ center, zoom: Math.max(MIN_ZOOM, zoom / 1.35) })
        }
      >
        <Minus />
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="icon-sm"
        aria-label="Reset map view"
        onClick={resetView}
        disabled={atDefault}
      >
        <RotateCcw />
      </Button>
    </div>
  );
}
