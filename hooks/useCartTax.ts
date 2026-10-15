import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

export interface CartTaxLine {
  product_id: number;
  quantity: number;
  price: number;
  line_total: number;
  tax: number | null;
  tax_id: number | null;
  tax_name: string | null;
}

/** POST /api/cart/tax: the ERP's state tax for the cart (see docs/client-api.md in the gateway). */
export interface CartTax {
  available: boolean;
  state: string | null;
  state_source: "account" | "address" | null;
  state_required: boolean;
  items: CartTaxLine[];
  subtotal: number;
  total_tax: number | null;
  total: number | null;
  message?: string;
}

interface CartTaxOptions {
  /** The checkout address whose state applies (the account's ERP state wins when it has one). */
  addressId?: number | null;
}

/**
 * Live tax quote for the given cart lines. Re-asked whenever the lines or the address change, so quantity
 * changes and a different checkout address update the tax. Only for approved accounts with something in the
 * cart; `data` stays undefined while loading and on errors (the cart and checkout still work without it).
 */
export function useCartTax(lines: { product_id: number; quantity: number }[], { addressId }: CartTaxOptions = {}) {
  const { user } = useAuth();
  const items = lines.filter((line) => line.quantity > 0).map((line) => ({ product_id: line.product_id, quantity: line.quantity }));
  const approved = user?.approval_status === "approved";

  return useQuery<CartTax>({
    queryKey: ["cart-tax", user?.id ?? null, addressId ?? null, items],
    enabled: approved && items.length > 0,
    queryFn: () =>
      api.post<{ data: CartTax }>("/cart/tax", { items, ...(addressId ? { address_id: addressId } : {}) }).then((response) => response.data.data),
    staleTime: 60 * 1000,
    retry: false,
    placeholderData: (previous) => previous,
  });
}
