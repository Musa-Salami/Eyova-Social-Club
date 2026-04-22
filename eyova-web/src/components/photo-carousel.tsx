"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export interface PhotoCarouselProps {
  images: string[];
  alt: string;
  intervalMs?: number;
  startIndex?: number;
  className?: string;
  showDots?: boolean;
  priority?: boolean;
}

export function PhotoCarousel({
  images,
  alt,
  intervalMs = 5000,
  startIndex = 0,
  className = "",
  showDots = true,
  priority = false,
}: PhotoCarouselProps) {
  const safeStart = images.length ? startIndex % images.length : 0;
  const [current, setCurrent] = useState(safeStart);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [images.length, intervalMs]);

  if (!images.length) return null;

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {images.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={index !== current}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority && index === safeStart}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      ))}

      {showDots && images.length > 1 ? (
        <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {images.map((src, index) => (
            <span
              key={`dot-${src}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === current
                  ? "w-5 bg-amber-300"
                  : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export const COMMUNITY_PHOTOS = [
  "/community/community-01.png",
  "/community/community-02.png",
  "/community/community-03.png",
  "/community/community-04.png",
  "/community/community-05.png",
  "/community/community-06.png",
  "/community/community-07.png",
  "/community/community-08.png",
  "/community/community-09.png",
];
