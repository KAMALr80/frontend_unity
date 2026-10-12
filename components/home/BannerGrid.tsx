import Link from "next/link";
import type { HomepageItem, HomepageSection } from "@/context/SiteConfigContext";
import { ManagedImage } from "./ManagedImage";

type Layout = "grid" | "mosaic" | "strips" | "pair" | "wide";

/** Shape of the banner art for each layout: the box reserves this ratio so images never shift the page. */
const LAYOUTS: Record<Layout, { width: number; height: number; sizes: string }> = {
  grid: { width: 956, height: 170, sizes: "(max-width: 767px) 100vw, 50vw" },
  mosaic: { width: 500, height: 300, sizes: "(max-width: 767px) 50vw, 33vw" },
  strips: { width: 1920, height: 200, sizes: "100vw" },
  pair: { width: 695, height: 200, sizes: "(max-width: 767px) 100vw, 50vw" },
  wide: { width: 1920, height: 250, sizes: "100vw" },
};

/** Phones show the tall mosaic tile beside two stacked tiles; from md the three columns of the reference page. */
const MOSAIC_TILE_CLASS = [
  "order-2 md:order-none md:col-start-1 md:row-start-1",
  "order-3 md:order-none md:col-start-1 md:row-start-2",
  "order-1 row-span-2 md:order-none md:col-start-2 md:row-start-1",
  "order-4 md:order-none md:col-start-3 md:row-start-1",
  "order-5 md:order-none md:col-start-3 md:row-start-2",
];

function Tile({ item, layout, index, priority }: { item: HomepageItem; layout: Layout; index: number; priority: boolean }) {
  const shape = LAYOUTS[layout];
  const tall = layout === "mosaic" && index === 2;
  const image = (
    <ManagedImage
      desktopSrc={item.desktop_image_url}
      mobileSrc={item.mobile_image_url}
      alt={item.alt_text || item.title || ""}
      width={tall ? 500 : shape.width}
      height={tall ? 640 : shape.height}
      sizes={shape.sizes}
      loading={priority ? "eager" : "lazy"}
      className={`block w-full ${tall ? "h-full object-cover" : "h-auto"}`}
    />
  );
  const classes = `group relative block overflow-hidden bg-muted ${layout === "mosaic" ? MOSAIC_TILE_CLASS[index] ?? "" : ""}`;
  return item.link_url
    ? <Link href={item.link_url} aria-label={item.alt_text || item.title || undefined} className={`${classes} transition-opacity hover:opacity-90`}>{image}</Link>
    : <div className={classes}>{image}</div>;
}

/** Image banners from a CMS "banner" section, laid out by its `layout` setting. */
export function BannerGrid({ section }: { section: HomepageSection }) {
  const items = section.items.filter((item) => item.kind !== "heading" && item.desktop_image_url);
  if (items.length === 0) return null;
  const layout = (typeof section.settings.layout === "string" && section.settings.layout in LAYOUTS ? section.settings.layout : "grid") as Layout;

  const grid = {
    grid: "grid-cols-1 md:grid-cols-2",
    mosaic: "grid-cols-2 md:grid-cols-3",
    strips: "grid-cols-1",
    pair: "grid-cols-1 md:grid-cols-2",
    wide: "grid-cols-1",
  }[layout];

  return (
    <section className={`w-full ${layout === "mosaic" ? "bg-muted py-4 sm:py-6" : "py-2 sm:py-3"}`} aria-label={section.title}>
      <h2 className="sr-only">{section.title}</h2>
      <div className={`mx-auto grid max-w-[1600px] gap-2 px-2 sm:gap-3 sm:px-4 lg:px-6 ${grid}`}>
        {items.map((item, index) => <Tile key={item.id} item={item} layout={layout} index={index} priority={false} />)}
      </div>
    </section>
  );
}
