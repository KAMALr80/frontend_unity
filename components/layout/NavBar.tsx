"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, LayoutGrid, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCategories, type Category } from "@/hooks/useCategories";
import { useSiteConfig } from "@/context/SiteConfigContext";

const NAV_LINK = "flex h-full items-center whitespace-nowrap px-3 text-sm font-bold text-white no-underline transition-colors hover:text-gold";

function matches(category: Category, keywords: readonly string[]) {
  const value = `${category.name} ${category.slug}`.toLowerCase();
  return keywords.some((keyword) => value.includes(keyword));
}
function categoryItems(category: Category) {
  return category.children && category.children.length > 0 ? category.children : [category];
}

export function NavBar() {
  const { data: categories = [] } = useCategories();
  const { site } = useSiteConfig();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const ALL = "__all__";

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOpen]);

  const groups = useMemo(
    () =>
      (site.nav_groups ?? []).map((group, index) => {
        // An explicit list of category names (kept in CMS order) wins over keyword matching.
        const named = (group.names ?? []).flatMap((name) => categories.find((category) => category.name.toLowerCase() === name.toLowerCase()) ?? []);
        const matched = named.length > 0 ? named : categories.filter((category) => matches(category, group.keywords));
        const fallback = categories[index] ? [categories[index]] : [];
        const roots = matched.length > 0 ? matched : fallback;
        return {
          ...group,
          items: roots.flatMap(categoryItems).slice(0, 48),
          href: group.url || (roots[0] ? `/category/${roots[0].id}` : "/shop"),
        };
      }),
    [categories, site.nav_groups]
  );
  const links = site.nav_links ?? [];
  const linksBefore = site.nav_links_before ?? [];
  const allCategoryLinks = site.all_categories ?? [];
  const activeMobileGroup = groups.find((group) => group.label === mobileSection);
  const closeMenus = () => setOpenMenu(null);

  return (
    <nav aria-label="Main" className="sticky top-0 z-40 border-t border-white/10 bg-black text-white shadow-sm">
      <div className="mx-auto hidden h-14 max-w-[1320px] items-stretch gap-1 px-6 xl:flex">
        {/* All categories: every top-level category with its first sub-categories. */}
        <div className="static flex items-center" onMouseEnter={() => setOpenMenu(ALL)} onMouseLeave={closeMenus}>
          <button type="button" onClick={() => setOpenMenu((value) => (value === ALL ? null : ALL))} onFocus={() => setOpenMenu(ALL)} aria-expanded={openMenu === ALL} className="flex h-10 min-w-[240px] items-center justify-between gap-3 bg-gold px-6 text-sm font-bold text-white transition hover:brightness-110">
            <span className="inline-flex items-center gap-2"><LayoutGrid size={15} /> All Categories</span><ChevronDown size={14} />
          </button>
          {openMenu === ALL && (
            <div className="absolute left-1/2 top-full max-h-[70vh] w-[min(1200px,calc(100vw-32px))] -translate-x-1/2 overflow-y-auto border border-t-0 border-border bg-background p-6 text-foreground shadow-lg">
              {allCategoryLinks.length > 0 ? (
                <ul className="grid grid-cols-4 gap-x-8 gap-y-2">
                  {allCategoryLinks.map((link) => <li key={`${link.label}-${link.url}`}><Link href={link.url} onClick={closeMenus} className="block border-b border-border py-2 text-sm font-bold uppercase text-foreground no-underline transition-colors hover:text-primary">{link.label}</Link></li>)}
                </ul>
              ) : categories.length > 0 ? (
                <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                  {categories.map((category) => (
                    <div key={category.id} className="min-w-0">
                      <Link href={`/category/${category.id}`} onClick={closeMenus} className="block border-b border-border pb-1.5 text-sm font-bold uppercase text-foreground no-underline transition-colors hover:text-primary">{category.name}</Link>
                      <ul className="mt-2 space-y-1">
                        {(category.children ?? []).slice(0, 5).map((child) => (
                          <li key={child.id}><Link href={`/category/${child.id}`} onClick={closeMenus} className="block truncate text-[13px] text-muted-foreground no-underline transition-colors hover:text-primary">{child.name}</Link></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : <p className="py-6 text-sm text-muted-foreground">Categories are loading…</p>}
            </div>
          )}
        </div>

        {linksBefore.map((link) => <Link key={`${link.label}-${link.url}`} href={link.url} className={NAV_LINK}>{link.label}</Link>)}

        {groups.map((group) => (
          <div key={group.label} className="static" onMouseEnter={() => setOpenMenu(group.label)} onMouseLeave={closeMenus}>
            <button type="button" onClick={() => setOpenMenu((value) => (value === group.label ? null : group.label))} onFocus={() => setOpenMenu(group.label)} aria-expanded={openMenu === group.label} className={`${NAV_LINK} gap-1`}>
              {group.label}<ChevronDown size={12} />
            </button>
            {openMenu === group.label && (
              <div className="absolute left-1/2 top-full w-[min(1120px,calc(100vw-32px))] -translate-x-1/2 overflow-hidden border border-t-0 border-border bg-background text-foreground shadow-lg">
                <div className="grid grid-cols-[1fr_220px]">
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                      <h2 className="text-sm font-bold uppercase tracking-[0.1em] text-foreground">{group.label}</h2>
                      <Link href={group.href} onClick={closeMenus} className="text-xs font-bold text-primary transition-colors hover:text-foreground">View all</Link>
                    </div>
                    <div className="grid grid-cols-3 gap-x-6 gap-y-2">
                      {group.items.length > 0 ? group.items.map((category) => (
                        <Link key={category.id} href={`/category/${category.id}`} onClick={closeMenus} className="flex min-h-12 items-center gap-3 px-2 py-2 text-sm font-medium text-foreground no-underline transition-colors hover:bg-muted hover:text-primary">
                          <span className="relative h-9 w-9 shrink-0 overflow-hidden border border-border bg-muted">
                            {category.image ? <Image src={category.image} alt="" fill sizes="36px" className="object-contain" /> : <span className="flex h-full items-center justify-center text-xs font-bold text-primary">{category.name.slice(0, 1)}</span>}
                          </span>
                          <span>{category.name}</span>
                        </Link>
                      )) : <p className="col-span-3 py-8 text-sm text-muted-foreground">Categories are loading…</p>}
                    </div>
                  </div>
                  <Link href={group.href} onClick={closeMenus} className="flex flex-col justify-end border-l border-border bg-black p-6 no-underline transition-colors hover:bg-neutral-900">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Featured</span>
                    <span className="mt-2 text-2xl font-bold uppercase leading-tight text-white">{group.label}</span>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold uppercase text-gold">Shop now <ChevronRight size={14} /></span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ))}

        {links.map((link) => <Link key={`${link.label}-${link.url}`} href={link.url} className={NAV_LINK}>{link.label}</Link>)}
        {site.sale_label && <Link href={site.sale_url || "/sale"} className="my-1.5 ml-2 flex items-center bg-gold px-3 text-[11px] font-bold uppercase tracking-[0.04em] text-gold-foreground no-underline transition hover:brightness-95">{site.sale_label}</Link>}
      </div>

      <div className="flex items-center justify-between px-3 py-0.5 xl:hidden">
        <button type="button" onClick={() => setMobileOpen(true)} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold uppercase tracking-wider text-white" aria-label="Open category menu"><Menu size={22} /> Menu</button>
        {site.sale_label && <Link href={site.sale_url || "/sale"} className="inline-flex min-h-9 items-center bg-gold px-3 text-xs font-bold uppercase tracking-wider text-gold-foreground no-underline">{site.sale_label}</Link>}
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <button className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <div className="absolute inset-y-0 left-0 flex w-[min(88vw,360px)] flex-col bg-black text-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-white/15 px-5">
              {mobileSection ? (
                <button type="button" onClick={() => setMobileSection(null)} className="text-xs font-bold uppercase tracking-wider text-white/70">← Back</button>
              ) : (
                <span className="text-xs font-bold uppercase tracking-wider text-gold">Menu</span>
              )}
              <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {activeMobileGroup ? (
                <>
                  <Link href={activeMobileGroup.href} onClick={() => setMobileOpen(false)} className="block border-b border-white/15 px-5 py-4 text-sm font-bold uppercase text-white no-underline">Shop all {activeMobileGroup.label}</Link>
                  {activeMobileGroup.items.map((category) => (
                    <Link key={category.id} href={`/category/${category.id}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-3 border-b border-white/15 px-5 py-3 text-sm text-white/85 no-underline transition-colors hover:bg-white/10">
                      <span className="relative h-9 w-9 shrink-0 overflow-hidden bg-white/10">{category.image && <Image src={category.image} alt="" fill sizes="36px" className="object-contain" />}</span>{category.name}
                    </Link>
                  ))}
                </>
              ) : (
                <>
                  {linksBefore.map((link) => <Link key={`${link.label}-${link.url}`} href={link.url} onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-white/15 px-5 py-4 text-sm font-bold uppercase text-white no-underline transition-colors hover:bg-white/10">{link.label}<ChevronRight size={17} className="text-white/50" /></Link>)}
                  {groups.map((group) => <button key={group.label} type="button" onClick={() => setMobileSection(group.label)} className="flex w-full items-center justify-between border-b border-white/15 px-5 py-4 text-left text-sm font-bold uppercase tracking-wide transition-colors hover:bg-white/10">{group.label}<ChevronRight size={17} className="text-white/50" /></button>)}
                  {links.map((link) => <Link key={`${link.label}-${link.url}`} href={link.url} onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-white/15 px-5 py-4 text-sm font-bold uppercase text-white no-underline transition-colors hover:bg-white/10">{link.label}<ChevronRight size={17} className="text-white/50" /></Link>)}
                  <Link href="/brands" onClick={() => setMobileOpen(false)} className="flex items-center justify-between border-b border-white/15 px-5 py-4 text-sm font-bold uppercase text-white no-underline transition-colors hover:bg-white/10">Shop By Brand<ChevronRight size={17} /></Link>
                  {site.sale_label && <Link href={site.sale_url || "/sale"} onClick={() => setMobileOpen(false)} className="block border-b border-white/15 px-5 py-4 text-sm font-bold uppercase text-gold no-underline transition-colors hover:bg-white/10">{site.sale_label}</Link>}
                  <Link href="/shop" onClick={() => setMobileOpen(false)} className="block px-5 py-4 text-sm font-bold uppercase text-white no-underline transition-colors hover:bg-white/10">Shop All</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
