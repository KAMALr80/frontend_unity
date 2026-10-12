/* eslint-disable @next/next/no-img-element -- the API already serves sized WebP variants (immutable cache); a plain srcset skips a second resize hop. */
import Image from "next/image";
import { imageVariant, variantSrcSet, type ImageVariants } from "@/lib/imageVariants";

interface ProductImageProps {
  src: string;
  variants?: ImageVariants | null;
  alt: string;
  /** Rendered width of the image, as for next/image (e.g. "(max-width: 639px) 46vw, 14vw"). */
  sizes: string;
  className?: string;
  /** The first, visible image of a page (largest contentful paint). */
  priority?: boolean;
}

/**
 * Product photo that fills its (relative) parent. With API variants the browser picks the right WebP size
 * straight from the API; without them (unsupported source) next/image optimizes the original.
 */
export function ProductImage({ src, variants, alt, sizes, className = "", priority = false }: ProductImageProps) {
  const srcSet = variantSrcSet(variants);
  if (srcSet) {
    return (
      <img
        src={imageVariant(src, variants, 512) ?? src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={`absolute inset-0 h-full w-full ${className}`}
      />
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} className={className} />;
}
