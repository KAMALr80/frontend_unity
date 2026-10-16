import type { Product } from "@/hooks/useProducts";
import { JsonLd, breadcrumbList } from "@/lib/jsonLd";
import { fetchApi } from "@/lib/site";
import { ProductDetail } from "./ProductDetail";

/**
 * Server-renders the product (the guest view: no prices) so its name, description, images and breadcrumb are in
 * the HTML search engines read; the browser then re-reads it with the buyer's prices. The fetch is shared with
 * the layout's (same request in one render).
 */
export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await fetchApi<Product>(`/products/${id}`);

  return (
    <>
      {product && (
        <JsonLd
          data={breadcrumbList([
            { name: "Shop", path: "/shop" },
            ...(product.category ? [{ name: product.category.name, path: `/category/${product.category.id}` }] : []),
            ...(product.brand ? [{ name: product.brand.name, path: `/brand/${product.brand.id}` }] : []),
            { name: product.name },
          ])}
        />
      )}
      <ProductDetail id={id} initialProduct={product} />
    </>
  );
}
