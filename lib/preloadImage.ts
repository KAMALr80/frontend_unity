import { getImageProps } from "next/image";
import { preload } from "react-dom";
import { imageVariant, variantSrcSet, type ImageVariants } from "@/lib/imageVariants";

/**
 * Server-side preload for a page's LCP image when the image itself is rendered by a client component after
 * its data loads. `sizes` must match the <Image fill sizes=…> that renders it, so the browser reuses the
 * preloaded response instead of fetching a second candidate.
 */
export function preloadFillImage(src: string, sizes: string) {
  const { props } = getImageProps({ src, alt: "", fill: true, sizes });
  preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: "high" });
}

/**
 * Preload for a product photo rendered by <ProductImage>. With API variants that component uses a plain <img>
 * with the variants' srcset, so the preload must name the same candidates (not a next/image URL, which the
 * browser would download as an extra copy); without variants it falls back to next/image like the component.
 */
export function preloadProductImage(src: string, variants: ImageVariants | null | undefined, sizes: string) {
  const srcSet = variantSrcSet(variants);
  if (!srcSet) {
    preloadFillImage(src, sizes);
    return;
  }
  preload(imageVariant(src, variants, 512) ?? src, { as: "image", imageSrcSet: srcSet, imageSizes: sizes, fetchPriority: "high" });
}
