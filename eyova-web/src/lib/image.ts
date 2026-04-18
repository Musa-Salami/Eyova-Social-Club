"use client";

type CompressOptions = {
  maxDim?: number;
  quality?: number;
  mimeType?: string;
};

/**
 * Compress an image File to a data URL.
 * - Resizes to fit within maxDim (default 800px)
 * - Re-encodes as JPEG at given quality (default 0.82)
 * - Keeps the result comfortably under the 1 MiB Firestore doc limit
 */
export async function compressImage(
  file: File,
  { maxDim = 800, quality = 0.82, mimeType = "image/jpeg" }: CompressOptions = {},
): Promise<string> {
  const dataUrl = await readAsDataUrl(file);
  const img = await loadImage(dataUrl);

  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    if (width >= height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported in this browser.");
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL(mimeType, quality);
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Failed to load image."));
    img.src = src;
  });
}

export type CropArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CropOptions = {
  maxDim?: number;
  quality?: number;
  mimeType?: string;
};

/**
 * Crops an image (from a data URL or object URL) to the given pixel area
 * and returns a compressed JPEG data URL.
 */
export async function getCroppedDataUrl(
  imageSrc: string,
  crop: CropArea,
  {
    maxDim = 800,
    quality = 0.82,
    mimeType = "image/jpeg",
  }: CropOptions = {},
): Promise<string> {
  const img = await loadImage(imageSrc);

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = Math.max(1, Math.round(crop.width));
  sourceCanvas.height = Math.max(1, Math.round(crop.height));
  const sourceCtx = sourceCanvas.getContext("2d");
  if (!sourceCtx) throw new Error("Canvas not supported in this browser.");
  sourceCtx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    sourceCanvas.width,
    sourceCanvas.height,
  );

  let { width, height } = sourceCanvas;
  if (width > maxDim || height > maxDim) {
    if (width >= height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  const outCanvas = document.createElement("canvas");
  outCanvas.width = width;
  outCanvas.height = height;
  const outCtx = outCanvas.getContext("2d");
  if (!outCtx) throw new Error("Canvas not supported in this browser.");
  outCtx.drawImage(sourceCanvas, 0, 0, width, height);
  return outCanvas.toDataURL(mimeType, quality);
}
