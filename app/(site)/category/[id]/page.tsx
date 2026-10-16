import { Suspense } from "react";
import type { Category } from "@/hooks/useCategories";
import { JsonLd, breadcrumbList } from "@/lib/jsonLd";
import { fetchApi } from "@/lib/site";
import { CategoryBrowse } from "./CategoryBrowse";

/**
 * Server-renders the category listing (this route renders per request, so the header, H1 and filters are in the
 * HTML) with its breadcrumb JSON-LD. The fetch is shared with the layout.
 */
export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await fetchApi<Category>(`/categories/${id}`);
  const name = category?.name ?? "Category";

  return (
    <>
      {category && <JsonLd data={breadcrumbList([{ name: "Shop", path: "/shop" }, { name }])} />}
      <Suspense>
        <CategoryBrowse id={id} initialCategory={category} />
      </Suspense>
    </>
  );
}
