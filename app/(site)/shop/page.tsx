import { Suspense } from "react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata = {
  title: "Shop All Wholesale Products",
  description: "Browse the full wholesale catalog by category and brand. Sign in to a wholesale account to see prices and order.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<PageHeader crumbs={[{ label: "Shop" }]} title="All Products" />}>
      <BrowseLayout
        crumbs={[{ label: "Shop" }]}
        title="All Products"
      />
    </Suspense>
  );
}
