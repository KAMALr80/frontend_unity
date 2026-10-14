"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartBarProps {
  /** Called when the user clicks "Add to cart" — undefined hides the button */
  onAddToCart?: () => void;
  cta?: string;
  /** Selection count for context-aware label, e.g. on browse pages */
  selectedCount?: number;
}

const BUTTON = "inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-md px-3 text-[11px] font-semibold uppercase tracking-[0.06em] sm:px-5 sm:tracking-[0.08em]";

/**
 * Sticky cart summary at the bottom of the screen. On phones it stays one tidy row: the cart count above the
 * subtotal on the left, short button labels on the right (the selection count moves into the add button).
 */
export function CartBar({ onAddToCart, cta = "ADD TO CART", selectedCount }: CartBarProps) {
  const { itemCount, subtotal } = useCart();

  if (itemCount === 0 && selectedCount === undefined) return null;

  const selected = selectedCount !== undefined && selectedCount > 0 ? selectedCount : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between gap-3 border-t border-border bg-card/95 px-3 py-2.5 text-[11.5px] tracking-[0.04em] text-card-foreground shadow-[0_-4px_18px_rgba(0,0,0,0.10)] backdrop-blur-md sm:px-4 sm:py-3 md:px-8">
      {/* Left — cart summary: stacked on phones, one line from tablets up */}
      <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4 md:gap-6">
        <span className="flex items-center gap-2 whitespace-nowrap">
          <ShoppingCart size={14} className="text-muted-foreground" />
          <span className="font-medium text-muted-foreground">CART</span>
          <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] leading-none text-primary-foreground">{itemCount}</span>
        </span>
        <span className="whitespace-nowrap text-muted-foreground">
          <span className="hidden sm:inline">SUBTOTAL </span>
          <span className="text-[13px] font-semibold text-foreground sm:text-[11.5px]">${subtotal.toFixed(2)}</span>
        </span>
        {selected > 0 && <span className="hidden whitespace-nowrap text-muted-foreground sm:inline">{selected} SELECTED</span>}
      </div>

      {/* Right — actions */}
      <div className="flex shrink-0 items-center gap-2">
        {onAddToCart && (
          <button type="button" onClick={onAddToCart} className={`${BUTTON} bg-primary text-primary-foreground shadow-sm transition-colors hover:bg-primary/90`}>
            <span className="sm:hidden">Add{selected > 0 ? ` (${selected})` : ""}</span>
            <span className="hidden sm:inline">{cta}</span>
          </button>
        )}
        <a href="/cart" className={`${BUTTON} border border-border bg-background text-foreground no-underline shadow-xs transition-colors hover:border-primary/50 hover:bg-accent`}>
          View cart →
        </a>
      </div>
    </div>
  );
}
