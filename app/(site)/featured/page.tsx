"use client";

import { Suspense } from "react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";

/** Products marked "featured" in the Gateway admin (Products > product > Mark as featured). */
export default function FeaturedPage() {
  return (
    <Suspense>
      <BrowseLayout crumbs={[{ label: "Featured Products" }]} title="Featured Products" featuredOnly />
    </Suspense>
  );
}
