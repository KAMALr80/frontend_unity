"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronRight, LayoutGrid, Menu, X } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useCategories, type Category } from "@/hooks/useCategories";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useAuth } from "@/context/AuthContext";

/** Menus with more items than this open as a wide five-column panel instead of a scrolling list. */
const WIDE_MENU_ITEMS = 24;

// Slightly tighter below 1536px so the full menu fits on a 1280px laptop screen without spilling over.
const NAV_LINK = "flex h-full items-center whitespace-nowrap px-2.5 text-[13px] font-bold text-white no-underline transition-colors hover:text-gold 2xl:px-3 2xl:text-sm";

function matches(category: Category, keywords: readonly string[]) {
  const value = `${category.name} ${category.slug}`.toLowerCase();
  return keywords.some((keyword) => value.includes(keyword));
}
function categoryItems(category: Category) {
  return category.children && category.children.length > 0 ? category.children : [category];
}

/**
 * Compact dropdown that hangs directly under its menu item (same pattern as the live site): a white card with a gold
 * top edge, one link per row, and a quiet "view all" footer. Long lists switch to two columns, and very long ones (Smoke Shop) to five so nothing needs scrolling.
 */
function DropPanel({ className = "", columns = 1, footer, onNavigate, children }: { className?: string; columns?: 1 | 2 | 5; footer: { label: string; href: string }; onNavigate: () => void; children: ReactNode }) {
  return (
    <div className={`absolute top-full z-40 ${columns === 5 ? "" : "max-h-[70vh] overflow-y-auto"} border-t-2 border-gold bg-background text-foreground shadow-[0_18px_32px_-12px_rgba(0,0,0,0.4)] ${className}`}>
      <div className={columns === 5 ? "grid grid-cols-5 gap-x-2 px-3 py-3" : columns === 2 ? "grid grid-cols-2 py-2" : "py-2"}>{children}</div>
      <Link href={footer.href} onClick={onNavigate} className="flex items-center justify-between gap-2 border-t border-border bg-muted/60 px-5 py-3 text-xs font-bold uppercase tracking-[0.06em] text-primary no-underline transition-colors hover:bg-muted hover:text-foreground">
        {footer.label}<ArrowRight size={13} />
      </Link>
    </div>
  );
}

function DropLink({ href, onNavigate, children }: { href: string; onNavigate: () => void; children: ReactNode }) {
  return (
    <Link href={href} onClick={onNavigate} className="block border-l-2 border-transparent px-5 py-2.5 text-[13px] font-semibold uppercase leading-snug tracking-[0.02em] text-foreground no-underline transition-colors hover:border-gold hover:bg-muted hover:text-primary">
      {children}
    </Link>
  );
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

  useEffect(() => {
    if (!openMenu) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [openMenu]);

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
  const { isAuthenticated } = useAuth();
  // Sign-up links (e.g. "Registration") mean nothing to a signed-in buyer.
  const forVisitor = (link: { url: string }) => !(isAuthenticated && /^\/register(\/|\?|$)/.test(link.url));
  const links = (site.nav_links ?? []).filter(forVisitor);
  const linksBefore = (site.nav_links_before ?? []).filter(forVisitor);
  const allCategoryLinks = site.all_categories ?? [];
  const activeMobileGroup = groups.find((group) => group.label === mobileSection);
  const closeMenus = () => setOpenMenu(null);

  return (
    <nav aria-label="Main" className="sticky top-0 z-40 border-t border-white/10 bg-black text-white shadow-sm">
      <div className="mx-auto hidden h-14 max-w-[1320px] items-stretch px-6 xl:flex">
        {/* All categories: the CMS list when set, otherwise the top-level categories. */}
        <div className="relative flex items-center" onMouseEnter={() => setOpenMenu(ALL)} onMouseLeave={closeMenus}>
          <button type="button" onClick={() => setOpenMenu((value) => (value === ALL ? null : ALL))} onFocus={() => setOpenMenu(ALL)} aria-expanded={openMenu === ALL} className="mr-2 flex h-10 min-w-[210px] items-center justify-between gap-3 bg-gold px-5 text-[13px] 2xl:min-w-[240px] 2xl:px-6 2xl:text-sm font-bold text-white transition hover:brightness-110">
            <span className="inline-flex items-center gap-2"><LayoutGrid size={15} /> All Categories</span><ChevronDown size={14} className={`transition-transform ${openMenu === ALL ? "rotate-180" : ""}`} />
          </button>
          {openMenu === ALL && (
            <DropPanel className="left-0 w-[300px]" footer={{ label: "Shop everything", href: "/shop" }} onNavigate={closeMenus}>
              {allCategoryLinks.length > 0
                ? allCategoryLinks.map((link) => <DropLink key={`${link.label}-${link.url}`} href={link.url} onNavigate={closeMenus}>{link.label}</DropLink>)
                : categories.length > 0
                  ? categories.map((category) => <DropLink key={category.id} href={`/category/${category.id}`} onNavigate={closeMenus}>{category.name}</DropLink>)
                  : <p className="px-5 py-4 text-sm text-muted-foreground">Categories are loading…</p>}
            </DropPanel>
          )}
        </div>

        {linksBefore.map((link) => <Link key={`${link.label}-${link.url}`} href={link.url} className={NAV_LINK}>{link.label}</Link>)}

        {groups.map((group) => (
          <div key={group.label} className={group.items.length > WIDE_MENU_ITEMS ? "static" : "relative"} onMouseEnter={() => setOpenMenu(group.label)} onMouseLeave={closeMenus}>
            <button type="button" onClick={() => setOpenMenu((value) => (value === group.label ? null : group.label))} onFocus={() => setOpenMenu(group.label)} aria-expanded={openMenu === group.label} className={`${NAV_LINK} gap-1 ${openMenu === group.label ? "text-gold" : ""}`}>
              {group.label}<ChevronDown size={12} className={`transition-transform ${openMenu === group.label ? "rotate-180" : ""}`} />
            </button>
            {openMenu === group.label && (
              <DropPanel className={group.items.length > WIDE_MENU_ITEMS ? "left-1/2 w-[min(1272px,calc(100vw-48px))] -translate-x-1/2" : `left-0 ${group.items.length > 10 ? "w-[500px]" : "w-[250px]"}`} columns={group.items.length > WIDE_MENU_ITEMS ? 5 : group.items.length > 10 ? 2 : 1} footer={{ label: `View all ${group.label}`, href: group.href }} onNavigate={closeMenus}>
                {group.items.length > 0
                  ? group.items.map((category) => <DropLink key={category.id} href={`/category/${category.id}`} onNavigate={closeMenus}>{category.name}</DropLink>)
                  : <p className="px-5 py-4 text-sm text-muted-foreground">Categories are loading…</p>}
              </DropPanel>
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
