"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import type { HomepageItem, HomepageSection } from "@/context/SiteConfigContext";

// Sections the CMS still offers but the Unity homepage does not use by default (category tiles, brand logos, catalog covers).
const CatalogFlipbook = dynamic(() => import("@/components/catalog/CatalogFlipbook"), { ssr: false });

function ImageHeading({ image, title }: { image?: string; title: string }) {
  if (!image) return <h2 className="sr-only">{title}</h2>;
  // The art is a 32:1 strip with the title centred in ~30% of its width. A fixed height per breakpoint keeps the
  // title fully inside the viewport on phones/tablets (object-cover crops only the decorative sides).
  // Because of that crop the image is drawn wider than the box (36px × 32 ≈ 1150px on a phone, 133vw at lg+).
  return <div className="relative mt-6 h-9 w-full overflow-hidden bg-brand-navy sm:h-12 md:h-14 lg:aspect-[24/1] lg:h-auto"><Image src={image} alt={title} fill sizes="(max-width: 1023px) 1920px, 134vw" loading="lazy" className="object-cover" /><h2 className="sr-only">{title}</h2></div>;
}

export function CategoryGrid({ section }: { section: HomepageSection }) {
  const headingImage = section.items.find((item) => item.kind === "heading")?.desktop_image_url;
  const categories = section.items.filter((item) => item.kind === "content" && item.desktop_image_url).map((item) => ({ key: String(item.id), name: item.title || item.alt_text, alt: item.alt_text, image: item.desktop_image_url, href: item.link_url }));
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const scrollToPhysicalIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const track = trackRef.current;
    const card = track?.children.item(index) as HTMLElement | null;
    if (!track || !card) return;
    // Align to the card's start (matches snap-start) so no half-cut card shows on narrow screens.
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior });
  }, []);
  const goToCategory = useCallback((index: number) => {
    if (!categories.length) return;
    scrollToPhysicalIndex(index);
    setActive(index);
  }, [categories.length, scrollToPhysicalIndex]);
  const move = useCallback((direction: number) => {
    if (!categories.length) return;
    setActive((current) => {
      const next = (current + direction + categories.length) % categories.length;
      scrollToPhysicalIndex(next);
      return next;
    });
  }, [categories.length, scrollToPhysicalIndex]);
  useEffect(() => {
    if (categories.length <= 7) return;    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [categories.length, move]);
  if (!categories.length) return null;
  const hasCarousel = categories.length > 7;
  return <section className="bg-background pb-8"><ImageHeading image={headingImage} title={section.title} /><div className="relative mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-10"><div ref={trackRef} className="category-track flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth py-1">{categories.map((category) => { const image = <div className="relative aspect-square overflow-hidden rounded-md bg-muted"><Image src={category.image} alt={category.alt} fill sizes="(max-width: 767px) 50vw, (max-width: 1023px) 25vw, (max-width: 1279px) 20vw, 15vw" className="object-cover transition duration-300 group-hover:scale-105" /></div>; const className = "group w-[calc((100%-12px)/2)] shrink-0 snap-start rounded-lg border border-border bg-card p-2 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:w-[calc((100%-36px)/4)] lg:w-[calc((100%-48px)/5)] xl:w-[calc((100%-72px)/7)]"; return category.href ? <Link key={category.key} href={category.href} aria-label={category.name || undefined} className={className}>{image}</Link> : <div key={category.key} className={className}>{image}</div>; })}</div></div>{hasCarousel && <div className="mt-2 flex flex-wrap justify-center">{categories.map((category, index) => <button key={category.key} type="button" onClick={() => goToCategory(index)} aria-label={`Show category ${index + 1}`} aria-current={index === active ? "true" : undefined} className="group grid min-h-6 min-w-6 place-items-center px-0.5">{/* small dot, 24px tap area */}<span className={`block h-1.5 rounded-full transition-all group-hover:bg-primary ${index === active ? "w-6 bg-primary" : "w-1.5 bg-border"}`} /></button>)}</div>}</section>;
}

export function BrandStrip({ section }: { section: HomepageSection }) {
  const headingImage = section.items.find((item) => item.kind === "heading")?.desktop_image_url;
  const brandImages = section.items.filter((item) => item.kind === "brand" && item.desktop_image_url).slice(0, 14);
  if (brandImages.length === 0) return null;
  return (
    <section className="bg-background pb-10">
      <ImageHeading image={headingImage} title={section.title} />
      <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-2 rounded-xl bg-muted px-4 py-5 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7">
        {brandImages.map((item) => (
          item.link_url ? <Link key={item.id} href={item.link_url} className="group flex h-24 items-center justify-center rounded-lg border border-transparent bg-card p-3 no-underline transition hover:border-border hover:shadow-sm"><span className="relative block h-full w-full"><Image src={item.desktop_image_url} alt={item.alt_text} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, (max-width: 1279px) 20vw, 15vw" className="object-contain transition group-hover:-translate-y-0.5" /></span></Link> : <div key={item.id} className="flex h-24 items-center justify-center rounded-lg bg-card p-3"><span className="relative block h-full w-full"><Image src={item.desktop_image_url} alt={item.alt_text} fill sizes="(max-width: 639px) 50vw, (max-width: 1023px) 25vw, (max-width: 1279px) 20vw, 15vw" className="object-contain" /></span></div>
        ))}
      </div>
    </section>
  );
}

/** CSS background for a small repeated tile, served by the image optimizer at 1x/2x instead of the full-size original. */
function tileBackground(src: string, size: number) {
  const { props } = getImageProps({ src, alt: "", width: size, height: size });
  const quote = (url: string) => `url("${url.replace(/["\\]/g, "")}")`;
  const candidates = (props.srcSet ?? "").split(", ").filter(Boolean).map((entry) => {
    const [url, density] = entry.split(" ");
    return `${quote(url)} ${density}`;
  });
  return candidates.length ? `image-set(${candidates.join(", ")})` : quote(props.src);
}

export function CatalogSection({ section, backgroundImage }: { section: HomepageSection; backgroundImage?: string | null }) {
  const catalogs = section.items.filter((item) => item.kind === "catalog" && item.desktop_image_url && item.pdf_url);
  const phrases = useMemo(() => Array.isArray(section.settings.heading_phrases) ? section.settings.heading_phrases.filter((value): value is string => typeof value === "string" && value.trim().length > 0) : [], [section.settings.heading_phrases]);
  const [wordIndex, setWordIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [openCatalog, setOpenCatalog] = useState<HomepageItem | null>(null);

  useEffect(() => {
    if (phrases.length === 0) return;
    const word = phrases[wordIndex % phrases.length];
    const isComplete = typedText === word;
    const isEmpty = typedText.length === 0;
    const delay = isComplete && !isDeleting ? 1800 : isDeleting ? 45 : 95;
    const timer = window.setTimeout(() => {
      if (isComplete && !isDeleting) setIsDeleting(true);
      else if (isDeleting && isEmpty) {
        setIsDeleting(false);
        setWordIndex((index) => (index + 1) % phrases.length);
      } else setTypedText(word.slice(0, typedText.length + (isDeleting ? -1 : 1)));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [isDeleting, phrases, typedText, wordIndex]);

  if (catalogs.length === 0) return null;
  return (
    <section className="bg-background px-2 py-6 sm:px-4 lg:px-6 lg:py-10">
      <div className="relative isolate overflow-hidden rounded-xl border border-border bg-brand-navy px-5 py-10 shadow-lg md:px-8 md:py-14 lg:px-12 lg:py-16">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-chart-2" />
        {backgroundImage && <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055]" style={{ backgroundImage: tileBackground(backgroundImage, 220), backgroundPosition: "center", backgroundRepeat: "repeat", backgroundSize: "220px 220px" }} />}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-brand-blue-deep/25 via-transparent to-black/25" />
        <div className="mx-auto grid max-w-[1600px] grid-cols-2 items-center gap-x-4 gap-y-8 sm:gap-x-8 lg:grid-cols-3 lg:gap-10 xl:gap-16">
        <div className="col-span-2 max-w-xl text-white lg:col-span-1 lg:pr-4">
          {typeof section.settings.eyebrow === "string" && section.settings.eyebrow && <span className="mb-4 inline-block border-l-4 border-chart-2 pl-3 text-xs font-bold tracking-[0.12em] text-chart-2">{section.settings.eyebrow}</span>}
          <h2 className="flex min-h-16 items-center text-3xl font-bold tracking-tight sm:text-4xl xl:text-5xl">
            <span className="typing-cursor">{phrases.length > 0 ? typedText : section.title}</span>
          </h2>
          {typeof section.settings.description === "string" && section.settings.description && <p className="mt-5 max-w-lg text-sm leading-7 text-white/75 md:text-base">{section.settings.description}</p>}
          <div aria-hidden="true" className="mt-7 h-px w-24 bg-chart-2" />
        </div>
        {catalogs.map((catalog) => (
          <button key={catalog.id} type="button" onClick={() => setOpenCatalog(catalog)} aria-label={`Open ${catalog.title || catalog.alt_text}`} className="catalog-book group mx-auto block w-full max-w-[350px] text-left focus-visible:outline-2 focus-visible:outline-chart-2">
            <div className="catalog-book-body relative aspect-[210/297]">
              <div aria-hidden="true" className="catalog-book-pages" />
              <div className="catalog-book-cover">
                <Image src={catalog.desktop_image_url} alt={catalog.alt_text} fill sizes="(max-width: 1023px) 50vw, 350px" className="object-cover" />
                <span className="catalog-book-title absolute inset-x-0 bottom-0 bg-white/95 px-3 py-2 text-center text-[11px] font-medium text-brand-navy">{catalog.title || catalog.alt_text}</span>
              </div>
              <span aria-hidden="true" className="catalog-book-spine" />
            </div>
          </button>
        ))}
        </div>
      </div>
      {openCatalog?.pdf_url && <CatalogFlipbook file={openCatalog.pdf_url} title={openCatalog.title || openCatalog.alt_text} onClose={() => setOpenCatalog(null)} />}
    </section>
  );
}
