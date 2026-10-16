import type { Brand } from "@/hooks/useBrands";
import { JsonLd, breadcrumbList } from "@/lib/jsonLd";
import { fetchApi } from "@/lib/site";
import { BrandDetail } from "./BrandDetail";

/** Server-renders the brand's name, image and breadcrumb (shared fetch with the layout); products load in the browser. */
export default async function BrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const brand = await fetchApi<Brand>(`/brands/${id}`);

  return (
    <>
      {brand && <JsonLd data={breadcrumbList([{ name: "Brands", path: "/brands" }, { name: brand.name }])} />}
      <BrandDetail id={id} initialBrand={brand} />
    </>
  );
}
