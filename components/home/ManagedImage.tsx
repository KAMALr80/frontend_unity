/* eslint-disable @next/next/no-img-element -- CMS image URLs are runtime values; getImageProps keeps them on the Next image optimizer and lets us add a mobile <source>. */
import { getImageProps } from "next/image";

interface ManagedImageProps {
  desktopSrc: string;
  mobileSrc?: string | null;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
}

/**
 * CMS image served through the Next image optimizer (resized, WebP/AVIF, srcset) with an optional
 * phone-sized art direction. Width/height only reserve the aspect ratio so the page does not shift.
 */
export function ManagedImage({ desktopSrc, mobileSrc, alt, width, height, sizes, loading = "lazy", fetchPriority = "auto", className }: ManagedImageProps) {
  const common = { alt, width, height, sizes, loading, fetchPriority };
  const { props: desktopProps } = getImageProps({ ...common, src: desktopSrc });

  if (!mobileSrc) return <img {...desktopProps} alt={alt} className={className} />;

  const { props: { srcSet: mobileSrcSet } } = getImageProps({ ...common, src: mobileSrc });
  return (
    <picture>
      <source media="(max-width: 640px)" srcSet={mobileSrcSet} sizes={sizes} />
      <img {...desktopProps} alt={alt} className={className} />
    </picture>
  );
}
