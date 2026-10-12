"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { Heart, Search, ShoppingBag, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { useWishlistCount } from "@/hooks/useWishlist";
import { Logo } from "./Logo";
import { UserAccountMenu } from "./UserAccountMenu";

function SearchForm({ className = "", idSuffix }: { className?: string; idSuffix: string }) {
  const router = useRouter();
  const { site } = useSiteConfig();
  const [search, setSearch] = useState("");

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = search.trim();
    if (!value) return;
    router.push(`/shop?search=${encodeURIComponent(value)}`);
    setSearch("");
  }

  return (
    <form onSubmit={handleSearch} role="search" className={`flex overflow-hidden border border-white/25 bg-white text-foreground focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/40 ${className}`}>
      <label htmlFor={`site-search-${idSuffix}`} className="sr-only">Search products, brands, or categories</label>
      <input id={`site-search-${idSuffix}`} type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={site.search_placeholder || "Search"} className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground" />
      <button type="submit" aria-label="Search" className="grid w-12 place-items-center bg-gold text-white transition hover:brightness-110"><Search size={19} /></button>
    </form>
  );
}

/** Account icon for signed-out visitors: opens a small panel with sign-in and register links. */
function GuestAccountMenu() {
  const { site } = useSiteConfig();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === "Escape" : ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-haspopup="true" aria-expanded={open} aria-label="Account" className="grid h-11 w-11 place-items-center text-gold transition-colors hover:text-white"><UserRound size={22} strokeWidth={1.6} /></button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-60 border border-border bg-card p-4 text-card-foreground shadow-lg">
          <p className="text-sm font-medium">Returning Customer?</p>
          <Link href="/login" onClick={() => setOpen(false)} className="mt-2 block bg-gold px-4 py-2.5 text-center text-xs font-bold uppercase text-gold-foreground no-underline transition hover:brightness-95">{site.login_text || "Sign in"}</Link>
          <p className="mt-4 text-sm font-medium">Don&apos;t have an account?</p>
          <Link href="/register" onClick={() => setOpen(false)} className="mt-2 block border border-border px-4 py-2.5 text-center text-xs font-bold uppercase text-foreground no-underline transition hover:border-gold hover:text-primary">{site.register_text || "Register"}</Link>
        </div>
      )}
    </div>
  );
}

export function UtilityBar() {
  const { isAuthenticated, user } = useAuth();
  const { itemCount, subtotal } = useCart();
  const wishlistCount = useWishlistCount();
  const { site } = useSiteConfig();
  const links = site.utility_links ?? [];

  return (
    <header className="bg-black text-white">
      {(site.utility_message || links.length > 0 || isAuthenticated) && (
        <div className="hidden border-b border-white/10 text-xs text-white/75 xl:block">
          <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-6 py-2">
            <span>{isAuthenticated ? <>Welcome, <span className="font-medium text-white">{user?.name}</span></> : site.utility_message}</span>
            <nav aria-label="Top links" className="flex items-center gap-5">
              {links.map((link) => <Link key={`${link.label}-${link.url}`} href={link.url} className="no-underline transition-colors hover:text-gold">{link.label}</Link>)}
              {isAuthenticated && (
                <>
                  <Link href="/orders" className="no-underline transition-colors hover:text-gold">Orders</Link>
                  <Link href="/account/addresses" className="no-underline transition-colors hover:text-gold">Addresses</Link>
                  <Link href="/account/profile" className="no-underline transition-colors hover:text-gold">Account details</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-3 py-3 sm:px-6 lg:gap-8">
        <Logo loading="eager" />
        <SearchForm idSuffix="desktop" className="mx-auto hidden w-full max-w-2xl lg:flex" />
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/wishlist" aria-label={`${wishlistCount} items in wishlist`} className="relative grid h-11 w-11 place-items-center text-white no-underline transition-colors hover:text-gold">
                <Heart size={22} strokeWidth={1.6} />
                {wishlistCount > 0 && <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">{wishlistCount}</span>}
              </Link>
              <UserAccountMenu />
              <Link href="/cart" aria-label={`${itemCount} items in cart`} className="flex items-center gap-2 text-white no-underline transition-colors hover:text-gold">
                <span className="relative grid h-11 w-11 place-items-center">
                  <ShoppingBag size={22} strokeWidth={1.6} />
                  <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-white">{itemCount}</span>
                </span>
                <span className="hidden text-sm font-medium sm:inline">${subtotal.toFixed(2)}</span>
              </Link>
            </>
          ) : (
            <GuestAccountMenu />
          )}
        </div>
      </div>
      <div className="px-3 pb-3 sm:px-6 lg:hidden"><SearchForm idSuffix="mobile" className="w-full" /></div>
    </header>
  );
}
