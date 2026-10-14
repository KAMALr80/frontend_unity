"use client";

import { Suspense } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/shared/ProductImage";
import { Heart, X } from "lucide-react";
import { useRequireAuth } from "@/components/auth/withAuth";
import { useWishlist, useToggleWishlist, type WishlistItem } from "@/hooks/useWishlist";
import { StockDot } from "@/components/shared/StockDot";
import { PageHeader } from "@/components/shared/PageHeader";

function addedOn(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Thumb({ item, size }: { item: WishlistItem; size: "sm" | "lg" }) {
  return (
    <div className={`${size === "lg" ? "h-20 w-20" : "h-10 w-10"} relative shrink-0 overflow-hidden rounded-md border border-border bg-muted`}>
      {item.image ? (
        <ProductImage src={item.image} variants={item.image_variants} alt={item.name} sizes={size === "lg" ? "80px" : "40px"} className="object-contain" />
      ) : (
        <div className="h-full w-full" style={{ background: "repeating-linear-gradient(135deg, var(--muted) 0 5px, var(--border) 5px 10px)" }} />
      )}
    </div>
  );
}

function RemoveButton({ item, onRemove }: { item: WishlistItem; onRemove: (productId: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onRemove(item.product_id)}
      className="inline-grid h-10 w-10 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive md:-m-2 md:h-9 md:w-9"
      aria-label={`Remove ${item.name} from wishlist`}
    >
      <X size={15} />
    </button>
  );
}

function WishlistTable() {
  const { isLoading: authLoading } = useRequireAuth();
  const { data: items, isLoading } = useWishlist();
  const toggle = useToggleWishlist();
  const remove = (productId: number) => void toggle(productId).catch(() => undefined);

  if (authLoading || isLoading) {
    return (
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 border-b border-border p-3 last:border-b-0 md:px-4">
            <div className="h-20 w-20 shrink-0 animate-pulse rounded-md bg-muted md:h-10 md:w-10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="flex h-52 flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card px-4 text-center shadow-sm">
        <Heart size={32} className="text-muted-foreground" />
        <p className="text-[13px] text-muted-foreground">Your wishlist is empty.</p>
        <Link href="/shop" className="inline-flex min-h-10 items-center rounded-md bg-primary px-5 text-[12px] font-semibold uppercase tracking-[0.06em] text-primary-foreground no-underline transition-colors hover:bg-primary/90">
          Browse products
        </Link>
      </div>
    );
  }

  const TH = "px-4 py-2.5 text-[10px] font-medium tracking-[0.08em] uppercase text-muted-foreground border-b border-border text-left bg-muted/60";
  const TD = "px-4 py-3 text-[12.5px] text-foreground border-b border-border align-middle";

  return (
    <>
      <p className="mb-3 text-[12px] text-muted-foreground">
        {items.length} saved {items.length === 1 ? "product" : "products"}
      </p>

      {/* Phones: one card per saved product, nothing scrolls sideways. */}
      <ul className="overflow-hidden rounded-lg border border-border bg-card shadow-sm md:hidden">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 border-b border-border p-3 last:border-b-0">
            <Link href={`/product/${item.product_id}`} className="shrink-0" aria-label={item.name}>
              <Thumb item={item} size="lg" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start gap-2">
                <Link href={`/product/${item.product_id}`} className="line-clamp-2 flex-1 text-[14px] font-medium leading-snug text-foreground no-underline hover:text-primary">
                  {item.name}
                </Link>
                <div className="-mr-2 -mt-2">
                  <RemoveButton item={item} onRemove={remove} />
                </div>
              </div>
              {item.sku && <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">SKU {item.sku}</p>}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted-foreground">
                <StockDot inStock={item.in_stock} stockQuantity={item.stock_quantity} />
                <span>Added {addedOn(item.added_at)}</span>
              </div>
              <Link
                href={`/product/${item.product_id}`}
                className="mt-2.5 inline-flex min-h-10 items-center justify-center self-start rounded-md border border-border px-4 text-[11px] font-semibold uppercase tracking-[0.06em] text-primary no-underline transition-colors hover:border-primary/60"
              >
                See price →
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Tablet and desktop: the table. */}
      <div className="hidden overflow-x-auto rounded-lg border border-border bg-card shadow-sm md:block">
        <table className="w-full border-collapse bg-card">
          <thead>
            <tr>
              <th className={`${TH} w-14`}><span className="sr-only">Image</span></th>
              <th className={TH}>Product</th>
              <th className={TH}>SKU</th>
              <th className={TH}>Stock</th>
              <th className={TH}>Added</th>
              <th className={TH}>Price</th>
              <th className={`${TH} w-10`}><span className="sr-only">Remove</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-muted/40">
                <td className={TD}>
                  <Thumb item={item} size="sm" />
                </td>
                <td className={TD}>
                  <Link href={`/product/${item.product_id}`} className="font-medium text-foreground transition-colors hover:text-primary">
                    {item.name}
                  </Link>
                </td>
                <td className={`${TD} text-[11.5px] text-muted-foreground`}>{item.sku}</td>
                <td className={TD}>
                  <StockDot inStock={item.in_stock} stockQuantity={item.stock_quantity} />
                </td>
                <td className={`${TD} text-[11.5px] text-muted-foreground`}>{addedOn(item.added_at)}</td>
                <td className={TD}>
                  <Link href={`/product/${item.product_id}`} className="text-[10.5px] font-medium uppercase tracking-[0.06em] text-primary transition-colors hover:text-primary/80">
                    See price →
                  </Link>
                </td>
                <td className={`${TD} text-center`}>
                  <RemoveButton item={item} onRemove={remove} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-muted/30 pb-28 md:pb-20">
      <PageHeader crumbs={[{ label: "Wishlist" }]} title="Wishlist" />
      <div className="mx-auto max-w-5xl px-4 py-6 md:px-8">
        <Suspense>
          <WishlistTable />
        </Suspense>
      </div>
    </div>
  );
}
