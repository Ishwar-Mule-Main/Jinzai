"use client";

import { useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Scaling,
  ChevronDown,
  Expand,
} from "lucide-react";

interface ZoomControlsProps {
  zoom: number;
  setZoom: (z: number) => void;
  isAutoFit?: boolean;
  onFitToWidth?: () => void;
  onFullscreen?: () => void;
}

export function ZoomControls({
  zoom,
  setZoom,
  isAutoFit = false,
  onFitToWidth,
  onFullscreen,
}: ZoomControlsProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const zoomIn = () => {
    setZoom(Math.min(1.75, +(zoom + 0.1).toFixed(2)));
  };

  const zoomOut = () => {
    setZoom(Math.max(0.4, +(zoom - 0.1).toFixed(2)));
  };

  const setPreset = (val: number) => {
    setZoom(val);
    setDropdownOpen(false);
  };

  const PRESETS = [
    { label: "50%", value: 0.5 },
    { label: "75%", value: 0.75 },
    { label: "90%", value: 0.9 },
    { label: "100%", value: 1.0 },
    { label: "125%", value: 1.25 },
    { label: "150%", value: 1.5 },
  ];

  return (
    <div className="relative flex items-center gap-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-1 select-none">
      {/* Zoom Out Button */}
      <button
        onClick={zoomOut}
        disabled={zoom <= 0.4}
        className="h-7 w-7 rounded-md flex items-center justify-center text-[#cccccc] hover:text-white hover:bg-[#242424] disabled:opacity-30 transition-colors"
        title="Zoom out"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>

      {/* Preset Percentage & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`h-7 px-2 rounded-md flex items-center gap-1 text-[11px] font-mono transition-colors ${
            isAutoFit
              ? "text-[#faff69] bg-[#242424] font-bold"
              : "text-[#cccccc] hover:text-white hover:bg-[#242424]"
          }`}
          title="Select zoom preset"
        >
          <span>{isAutoFit ? `Fit (${Math.round(zoom * 100)}%)` : `${Math.round(zoom * 100)}%`}</span>
          <ChevronDown className="w-3 h-3 text-[#888888]" />
        </button>

        {dropdownOpen && (
          <div
            className="absolute top-full left-0 mt-1.5 w-32 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-2xl py-1 z-50 text-xs font-mono"
            onMouseLeave={() => setDropdownOpen(false)}
          >
            {onFitToWidth && (
              <button
                onClick={() => {
                  onFitToWidth();
                  setDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#242424] transition-colors ${
                  isAutoFit ? "text-[#faff69] font-bold" : "text-white"
                }`}
              >
                <span>Fit Screen</span>
                <Scaling className="w-3 h-3 text-[#faff69]" />
              </button>
            )}
            <div className="h-[1px] bg-[#2a2a2a] my-1" />
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => setPreset(p.value)}
                className={`w-full text-left px-3 py-1.5 text-xs hover:bg-[#242424] transition-colors flex items-center justify-between ${
                  !isAutoFit && Math.abs(zoom - p.value) < 0.03
                    ? "text-[#faff69] font-bold"
                    : "text-[#cccccc]"
                }`}
              >
                <span>{p.label}</span>
                {!isAutoFit && Math.abs(zoom - p.value) < 0.03 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#faff69]" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom In Button */}
      <button
        onClick={zoomIn}
        disabled={zoom >= 1.75}
        className="h-7 w-7 rounded-md flex items-center justify-center text-[#cccccc] hover:text-white hover:bg-[#242424] disabled:opacity-30 transition-colors"
        title="Zoom in"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>

      {/* Fit to Width Button */}
      {onFitToWidth && (
        <button
          onClick={onFitToWidth}
          className={`h-7 px-2.5 rounded-md flex items-center gap-1 text-[11px] font-mono transition-colors ${
            isAutoFit
              ? "bg-[#faff69] text-[#0a0a0a] font-bold"
              : "text-[#cccccc] hover:text-white hover:bg-[#242424]"
          }`}
          title="Fit resume to column width"
        >
          <Scaling className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Fit</span>
        </button>
      )}

      {/* 100% Reset Button */}
      <button
        onClick={() => setPreset(1.0)}
        className="h-7 w-7 rounded-md flex items-center justify-center text-[#cccccc] hover:text-[#faff69] hover:bg-[#242424] transition-colors"
        title="Reset zoom to 100%"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>

      {/* Fullscreen Preview Lightbox Button */}
      {onFullscreen && (
        <button
          onClick={onFullscreen}
          className="h-7 w-7 rounded-md flex items-center justify-center text-[#cccccc] hover:text-[#faff69] hover:bg-[#242424] transition-colors"
          title="Fullscreen preview"
        >
          <Expand className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
