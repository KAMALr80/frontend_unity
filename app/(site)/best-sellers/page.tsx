"use client";

import { Suspense } from "react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { PageHeader } from "@/components/shared/PageHeader";

/** Products ranked as best sellers in the Gateway admin (Products > product > Mark as best seller), in rank order. */
export default function BestSellersPage() {
  return (
    <Suspense fallback={<PageHeader crumbs={[{ label: "Best Sellers" }]} title="Best Sellers" />}>
      <BrowseLayout crumbs={[{ label: "Best Sellers" }]} title="Best Sellers" bestSellerOnly defaultSort="best_selling" />
    </Suspense>
  );
}
