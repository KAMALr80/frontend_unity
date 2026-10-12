"use client";

import { ProductImage } from "@/components/shared/ProductImage";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/hooks/useProducts";

const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

/** Compact catalogue card used by the homepage carousels. Price and cart actions follow the wholesale account rules. */
export function HomeProductCard({ product }: { product: Product }) {
  const { isAuthenticated, isApproved } = useAuth();
  const { addItem } = useCart();
  const image = product.image ?? product.images?.find((item) => item.is_primary)?.url ?? null;
  const price = product.current_price ?? product.sale_price ?? product.regular_price;
  const canShowPrice = isAuthenticated && isApproved && product.prices_visible && price !== null;
  const canAdd = canShowPrice && price !== null && price > 0 && product.type === "simple" && product.in_stock;
  const href = `/product/${product.id}`;

  function addToCart() {
    if (!canAdd || price === null) return;
    addItem({ product_id: product.id, name: product.name, sku: product.sku, image, price, parent_id: product.parent_id }, 1);
  }

  return (
    <article className="group relative flex h-full flex-col bg-card px-2.5 pb-3 pt-3 transition-shadow hover:z-10 hover:shadow-[0_4px_18px_rgba(0,0,0,0.14)] sm:px-3">
      <Link href={href} className="block no-underline">
        <p className="min-h-[2.4em] text-[10px] font-medium uppercase leading-tight text-muted-foreground">{product.category?.name ?? " "}</p>
        <h3 title={product.name} className="mt-1 line-clamp-3 min-h-[3.6em] text-[11.5px] font-bold uppercase leading-[1.2] text-primary transition-colors group-hover:text-foreground sm:text-xs">{product.name}</h3>
      </Link>
      <Link href={href} aria-label={image ? undefined : `No image available. View ${product.name}`} className="relative mt-2 block aspect-square overflow-hidden bg-card">
        {image ? (
          <ProductImage
            src={image}
            variants={product.image_variants}
            alt={product.name}
            sizes="(max-width: 639px) 46vw, (max-width: 1199px) 24vw, 14vw"
            className="object-contain transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <span aria-hidden="true" className="grid h-full place-items-center bg-muted text-center text-[11px] font-bold uppercase text-muted-foreground">No image<br />available</span>
        )}
      </Link>
      {product.sku && <p className="mt-2 truncate text-[11px] text-muted-foreground">SKU: {product.sku}</p>}
      <div className="mt-auto flex min-h-11 items-end justify-between gap-2 pt-2">
        {!isAuthenticated ? (
          <Link href="/login" className="inline-flex min-h-9 w-full items-center justify-center bg-gold px-3 text-xs font-bold uppercase text-gold-foreground no-underline transition hover:brightness-95">Login to Buy</Link>
        ) : !canShowPrice ? (
          <span className="inline-flex min-h-9 w-full items-center justify-center bg-muted px-2 text-center text-[11px] font-bold uppercase text-muted-foreground">Pending price approval</span>
        ) : (
          <>
            <span className="text-base font-bold leading-none text-foreground sm:text-lg">{money(price!)}</span>
            {canAdd ? (
              <button type="button" onClick={addToCart} aria-label={`Add ${product.name} to cart`} className="grid h-9 w-9 shrink-0 place-items-center bg-gold text-gold-foreground transition hover:brightness-95"><ShoppingCart size={17} /></button>
            ) : (
              <Link href={href} aria-label={`View ${product.name}`} className="grid h-9 w-9 shrink-0 place-items-center bg-muted text-muted-foreground no-underline transition hover:bg-gold hover:text-gold-foreground"><ArrowRight size={17} /></Link>
            )}
          </>
        )}
      </div>
      {!product.in_stock && <span className="absolute left-2 top-2 bg-destructive px-1.5 py-0.5 text-[11px] font-bold text-white">Sold out</span>}
    </article>
  );
}
