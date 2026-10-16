"use client";

import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { useCategory, type Category } from "@/hooks/useCategories";

/** The category listing. `initialCategory` is the server-rendered copy, so there is no loading flash. */
export function CategoryBrowse({ id, initialCategory }: { id: string; initialCategory?: Category | null }) {
  const { data: category, isLoading } = useCategory(id, initialCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40 font-mono text-[11px] text-brand-muted tracking-widest uppercase">
        Loading…
      </div>
    );
  }

  return (
    <BrowseLayout
      categoryId={Number(id)}
      categoryName={category?.name}
      subCategories={category?.children ?? []}
      crumbs={[
        { label: "Shop", href: "/shop" },
        { label: category?.name ?? "Category" },
      ]}
      title={category?.name ?? "Category"}
    />
  );
}
