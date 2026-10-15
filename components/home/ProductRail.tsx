"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { HomepageSection } from "@/context/SiteConfigContext";
import { HomeProductCard } from "./HomeProductCard";
import { useHomeProducts } from "./HomeProducts";

/** Cards per row: 2 on phones up to 7 on very wide screens (the reference carousel shows 7). */
const CARD_WIDTH = "w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5 xl:w-1/6 2xl:w-[14.2857%]";

/** Product carousel for a CMS product_carousel section. Renders nothing when the API returned no products for it. */
export function ProductRail({ section }: { section: HomepageSection }) {
  const products = useHomeProducts();
  const items = (section.data?.product_ids ?? []).flatMap((id) => products.get(id) ?? []);
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const total = Math.max(1, Math.ceil(track.scrollWidth / track.clientWidth - 0.01));
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    setPages(total);
    setPage(atEnd ? total - 1 : Math.min(total - 1, Math.round(track.scrollLeft / track.clientWidth)));
    setCanPrev(track.scrollLeft > 2);
    setCanNext(!atEnd);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, [measure, items.length]);

  if (items.length === 0) return null;
  const goTo = (target: number) => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: target * track.clientWidth, behavior: "smooth" });
  };
  // The arrows move one product at a time (the dots below still jump a whole page).
  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (track && card) track.scrollBy({ left: direction * card.offsetWidth, behavior: "smooth" });
  };
  const actionText = typeof section.settings.action_text === "string" ? section.settings.action_text : "";
  const actionUrl = typeof section.settings.action_url === "string" ? section.settings.action_url : "";

  return (
    <section className="mx-auto w-full max-w-[1600px] px-2 pt-6 sm:px-4 lg:px-6" aria-label={section.title}>
      {/* Shop-style section heading: bold title with a gold underline sitting on the full-width rule. */}
      <header className="mb-3 flex items-end justify-between gap-4 border-b border-border">
        <h2 className="-mb-px border-b-2 border-gold pb-2.5 text-[17px] font-bold uppercase leading-none tracking-[0.06em] text-foreground sm:text-xl">{section.title}</h2>
        {actionText && actionUrl && (
          <Link href={actionUrl} className="group mb-2 inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground no-underline transition-colors hover:text-primary">
            {actionText}
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </header>
      <div className="relative">
        <div ref={trackRef} onScroll={measure} className="category-track flex snap-x snap-mandatory overflow-x-auto scroll-smooth">
          {items.map((product) => (
            <div key={product.id} className={`${CARD_WIDTH} shrink-0 snap-start border-r border-border/60 last:border-r-0`}>
              <HomeProductCard product={product} />
            </div>
          ))}
        </div>
        {pages > 1 && (
          <>
            <button type="button" onClick={() => step(-1)} disabled={!canPrev} aria-label={`Previous ${section.title} product`} className="absolute -left-1 top-1/2 z-10 grid h-9 w-7 -translate-y-1/2 place-items-center bg-white/90 text-foreground shadow transition hover:bg-gold disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white/90 sm:-left-2"><ChevronLeft size={18} /></button>
            <button type="button" onClick={() => step(1)} disabled={!canNext} aria-label={`Next ${section.title} product`} className="absolute -right-1 top-1/2 z-10 grid h-9 w-7 -translate-y-1/2 place-items-center bg-white/90 text-foreground shadow transition hover:bg-gold disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white/90 sm:-right-2"><ChevronRight size={18} /></button>
          </>
        )}
      </div>
      <div className="flex h-7 items-center justify-center gap-1" aria-hidden={pages <= 1}>
        {pages > 1 && Array.from({ length: pages }, (_, index) => (
          <button key={index} type="button" onClick={() => goTo(index)} aria-label={`Show page ${index + 1}`} aria-current={index === page ? "true" : undefined} className="group grid min-h-6 min-w-6 place-items-center">
            <span className={`block h-1.5 rounded-full transition-all ${index === page ? "w-6 bg-gold" : "w-1.5 bg-border group-hover:bg-gold/60"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
