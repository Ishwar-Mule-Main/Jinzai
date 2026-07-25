"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

export function ZoomControls({ zoom, setZoom }: { zoom: number; setZoom: (z: number) => void }) {
  const zoomIn = () => setZoom(Math.min(1.5, zoom + 0.1));
  const zoomOut = () => setZoom(Math.max(0.5, zoom - 0.1));
  const reset = () => setZoom(1);

  return (
    <div className="flex items-center gap-1 bg-background border rounded-md p-0.5">
      <Button variant="ghost" size="icon" onClick={zoomOut} disabled={zoom <= 0.5} className="h-7 w-7" title="Zoom out">
        <ZoomOut className="w-3.5 h-3.5" />
      </Button>
      <span className="text-[10px] font-mono text-muted-foreground w-10 text-center">
        {Math.round(zoom * 100)}%
      </span>
      <Button variant="ghost" size="icon" onClick={zoomIn} disabled={zoom >= 1.5} className="h-7 w-7" title="Zoom in">
        <ZoomIn className="w-3.5 h-3.5" />
      </Button>
      <Button variant="ghost" size="icon" onClick={reset} className="h-7 w-7" title="Reset zoom (100%)">
        <Maximize2 className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
