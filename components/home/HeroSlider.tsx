"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { HomepageSection } from "@/context/SiteConfigContext";
import { ManagedImage } from "./ManagedImage";

function subscribeWindowLoad(onChange: () => void) {
  window.addEventListener("load", onChange);
  return () => window.removeEventListener("load", onChange);
}

/** Full-width promotion slider. Slides come from the CMS hero section; only the visible slide and its neighbours are mounted. */
export function HeroSlider({ section }: { section: HomepageSection }) {
  const slides = section.items
    .filter((item) => item.kind === "slide" && item.desktop_image_url)
    .map((item) => ({ id: item.id, image: item.desktop_image_url, mobileImage: item.mobile_image_url, alt: item.alt_text || item.title || "", href: item.link_url }));
  const [active, setActive] = useState(0);
  const interval = typeof section.settings.interval_ms === "number" ? section.settings.interval_ms : 5000;
  const pageLoaded = useSyncExternalStore(subscribeWindowLoad, () => document.readyState === "complete", () => false);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), interval);
    return () => window.clearInterval(timer);
  }, [slides.length, interval]);

  if (slides.length === 0) return null;
  const move = (direction: number) => setActive((value) => (value + direction + slides.length) % slides.length);
  // The first slide is the LCP image. Neighbours are mounted only after the page has loaded so they never compete with it.
  const mounted = new Set(pageLoaded ? [active, (active - 1 + slides.length) % slides.length, (active + 1) % slides.length] : [active]);
  const hasMobileArt = slides.every((slide) => slide.mobileImage);

  return (
    <section className="relative isolate overflow-hidden bg-brand-navy" aria-roledescription="carousel" aria-label={section.title || "Featured promotions"}>
      <div className={`relative aspect-[1920/622] w-full ${hasMobileArt ? "min-h-[210px] sm:min-h-0" : ""}`}>
        {slides.map((slide, index) => {
          if (!mounted.has(index)) return null;
          const first = index === 0;
          const image = (
            <ManagedImage
              desktopSrc={slide.image}
              mobileSrc={slide.mobileImage}
              alt={slide.alt}
              width={1920}
              height={622}
              sizes="100vw"
              loading={first || index === active ? "eager" : "lazy"}
              fetchPriority={first ? "high" : "low"}
              className="absolute inset-0 h-full w-full object-cover"
            />
          );
          const className = `absolute inset-0 transition-opacity duration-700 ${active === index ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`;
          return slide.href
            ? <Link key={slide.id} href={slide.href} aria-hidden={active !== index} tabIndex={active === index ? undefined : -1} className={className}>{image}</Link>
            : <div key={slide.id} aria-hidden={active !== index} className={className}>{image}</div>;
        })}
        {slides.length > 1 && (
          <>
            <button type="button" onClick={() => move(-1)} aria-label="Previous slide" className="absolute left-2 top-1/2 z-20 grid h-10 w-7 -translate-y-1/2 place-items-center bg-black/55 text-white transition hover:bg-gold hover:text-gold-foreground sm:left-3 sm:h-11 sm:w-8"><ChevronLeft size={20} /></button>
            <button type="button" onClick={() => move(1)} aria-label="Next slide" className="absolute right-2 top-1/2 z-20 grid h-10 w-7 -translate-y-1/2 place-items-center bg-black/55 text-white transition hover:bg-gold hover:text-gold-foreground sm:right-3 sm:h-11 sm:w-8"><ChevronRight size={20} /></button>
          </>
        )}
      </div>
    </section>
  );
}
