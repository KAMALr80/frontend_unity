"use client";

/* eslint-disable @next/next/no-img-element -- full-size viewer shows the largest image as is. */
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { imageVariant, type ImageVariants } from "@/lib/imageVariants";

interface LightboxImage {
  url: string;
  variants?: ImageVariants | null;
}

/**
 * Full-screen product image viewer: largest available image, previous/next for galleries, closes on Esc, on the
 * close button or a click on the backdrop. Touch screens can pinch to zoom further.
 */
export function ImageLightbox({ images, index, alt, onIndex, onClose }: { images: LightboxImage[]; index: number; alt: string; onIndex: (index: number) => void; onClose: () => void }) {
  const many = images.length > 1;
  const go = (step: number) => onIndex((index + step + images.length) % images.length);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (many && event.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
      if (many && event.key === "ArrowRight") onIndex((index + 1) % images.length);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKey);
    };
  }, [index, images.length, many, onClose, onIndex]);

  const image = images[index];
  if (!image) return null;

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${alt} – full-size image`} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-10" onClick={onClose}>
      <img
        src={imageVariant(image.url, image.variants, 1024) ?? image.url}
        alt={alt}
        className="max-h-full max-w-full object-contain"
        onClick={(event) => event.stopPropagation()}
      />
      <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
        <X size={22} />
      </button>
      {many && (
        <>
          <button type="button" onClick={(event) => { event.stopPropagation(); go(-1); }} aria-label="Previous image" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <ChevronLeft size={24} />
          </button>
          <button type="button" onClick={(event) => { event.stopPropagation(); go(1); }} aria-label="Next image" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20">
            <ChevronRight size={24} />
          </button>
          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70">{index + 1} / {images.length}</span>
        </>
      )}
    </div>,
    document.body,
  );
}
