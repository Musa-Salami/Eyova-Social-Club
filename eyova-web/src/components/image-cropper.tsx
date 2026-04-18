"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { getCroppedDataUrl, type CropArea } from "@/lib/image";

type Props = {
  imageSrc: string;
  aspect?: number;
  cropShape?: "rect" | "round";
  title?: string;
  subtitle?: string;
  maxDim?: number;
  quality?: number;
  onCancel: () => void;
  onApply: (dataUrl: string) => void;
};

export function ImageCropper({
  imageSrc,
  aspect = 1,
  cropShape = "rect",
  title = "Adjust image",
  subtitle = "Pinch, drag or zoom to fit the frame.",
  maxDim = 600,
  quality = 0.85,
  onCancel,
  onApply,
}: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<CropArea | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onCancel]);

  const onCropComplete = useCallback(
    (_: unknown, areaPixels: CropArea) => setPixels(areaPixels),
    [],
  );

  const apply = async () => {
    if (!pixels) return;
    setProcessing(true);
    setError("");
    try {
      const cropped = await getCroppedDataUrl(imageSrc, pixels, {
        maxDim,
        quality,
      });
      onApply(cropped);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to crop image.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cropper-title"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-cyan-200/20 bg-slate-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-5">
          <div>
            <h3
              id="cropper-title"
              className="text-lg font-semibold text-white"
            >
              {title}
            </h3>
            <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white hover:border-amber-300 hover:text-amber-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="relative h-80 w-full bg-slate-950 md:h-96">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape={cropShape}
            showGrid
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            objectFit="contain"
            style={{
              containerStyle: { background: "#020617" },
              cropAreaStyle: {
                border: "2px solid rgba(252, 211, 77, 0.9)",
                boxShadow: "0 0 0 9999px rgba(2, 6, 23, 0.65)",
              },
            }}
          />
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1 flex items-center justify-between text-xs text-slate-300">
              <span>Zoom</span>
              <span className="tabular-nums text-slate-400">
                {zoom.toFixed(2)}×
              </span>
            </label>
            <input
              type="range"
              min={1}
              max={4}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setCrop({ x: 0, y: 0 });
              }}
              className="rounded-lg border border-cyan-200/25 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-300/10"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(4, z + 0.25))}
              className="rounded-lg border border-cyan-200/25 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-300/10"
            >
              Zoom +
            </button>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
              className="rounded-lg border border-cyan-200/25 px-3 py-2 text-xs text-cyan-100 hover:bg-cyan-300/10"
            >
              Zoom −
            </button>
          </div>
          {error ? (
            <p className="text-xs text-rose-300">{error}</p>
          ) : null}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={processing}
              className="rounded-lg border border-cyan-200/30 px-4 py-2 text-sm text-cyan-100 hover:bg-cyan-300/10 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={apply}
              disabled={processing || !pixels}
              className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-60"
            >
              {processing ? "Processing..." : "Apply crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
