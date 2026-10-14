"use client";

/* eslint-disable @next/next/no-img-element -- the zoom layer must be a plain image we can transform freely. */
import { useState, type PointerEvent } from "react";
import { Search } from "lucide-react";
import { ProductImage } from "@/components/shared/ProductImage";
import { imageVariant, type ImageVariants } from "@/lib/imageVariants";

/** How much the image is magnified under the pointer. */
const ZOOM = 2.2;

interface ZoomImageProps {
  src: string;
  variants?: ImageVariants | null;
  alt: string;
  sizes: string;
  /** Opens the full-screen viewer (the magnifier button, or a tap on touch screens). */
  onOpen: () => void;
}

/**
 * Product photo with the usual shop "inner zoom": on a mouse/trackpad the picture is magnified inside its own
 * frame and follows the pointer; a click, or a tap on touch screens, opens the full-screen viewer. The magnified
 * layer uses the largest variant, so it stays sharp, and is only fetched once the pointer is over the image.
 */
export function ZoomImage({ src, variants, alt, sizes, onOpen }: ZoomImageProps) {
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const zoomSrc = imageVariant(src, variants, 1024) ?? src;

  function follow(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((event.clientX - box.left) / box.width) * 100));
    const y = Math.min(100, Math.max(0, ((event.clientY - box.top) / box.height) * 100));
    setOrigin({ x, y });
  }

  return (
    <div
      className="absolute inset-0 cursor-zoom-in"
      onPointerEnter={follow}
      onPointerMove={follow}
      onPointerLeave={() => setOrigin(null)}
      // Hover magnifies in place; a click (or a tap, since touch has no hover) opens the full-screen viewer.
      onClick={onOpen}
    >
      {/* Base and magnified layers share one transform, so the base shows zoomed at once and the sharper layer
          lands exactly on top of it when it has loaded. */}
      <div className="absolute inset-0" style={origin ? { transform: `scale(${ZOOM})`, transformOrigin: `${origin.x}% ${origin.y}%` } : undefined}>
        <ProductImage src={src} variants={variants} alt={alt} sizes={sizes} className="object-contain" priority />
        {origin && <img src={zoomSrc} alt="" aria-hidden="true" decoding="async" className="pointer-events-none absolute inset-0 h-full w-full object-contain" />}
      </div>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onOpen();
        }}
        aria-label="View full-size image"
        className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full border border-border bg-card/90 text-foreground shadow-sm transition-colors hover:border-gold hover:text-primary"
      >
        <Search size={16} />
      </button>
    </div>
  );
}
