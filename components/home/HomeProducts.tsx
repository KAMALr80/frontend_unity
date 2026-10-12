"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProducts, type Product } from "@/hooks/useProducts";

const HomeProductsContext = createContext<ReadonlyMap<number, Product>>(new Map());

/**
 * Products shown by the homepage carousels, resolved once for the whole page.
 * - Guests use the list the server already fetched (public catalogue data, no prices), so no browser request is made.
 * - Signed-in users get one extra request with their token so wholesale prices and cart actions appear.
 */
export function HomeProductsProvider({ ids, initial, children }: { ids: number[]; initial: Product[]; children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { data } = useProducts(isAuthenticated && ids.length > 0 ? { ids, per_page: ids.length } : { per_page: 1 }, { enabled: isAuthenticated && ids.length > 0 });
  const products = useMemo(() => {
    const byId = new Map(initial.map((product) => [product.id, product]));
    if (isAuthenticated) for (const product of data?.data ?? []) byId.set(product.id, product);
    return byId;
  }, [data, initial, isAuthenticated]);
  return <HomeProductsContext.Provider value={products}>{children}</HomeProductsContext.Provider>;
}

export function useHomeProducts() {
  return useContext(HomeProductsContext);
}
