"use client";

import { Suspense } from "react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";

/** Products ranked as best sellers in the Gateway admin (Products > product > Mark as best seller), in rank order. */
export default function BestSellersPage() {
  return (
    <Suspense>
      <BrowseLayout crumbs={[{ label: "Best Sellers" }]} title="Best Sellers" bestSellerOnly defaultSort="best_selling" />
    </Suspense>
  );
}
