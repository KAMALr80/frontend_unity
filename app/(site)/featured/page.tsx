"use client";

import { Suspense } from "react";
import { BrowseLayout } from "@/components/browse/BrowseLayout";
import { PageHeader } from "@/components/shared/PageHeader";

/** Products marked "featured" in the Gateway admin (Products > product > Mark as featured). */
export default function FeaturedPage() {
  return (
    <Suspense fallback={<PageHeader crumbs={[{ label: "Featured Products" }]} title="Featured Products" />}>
      <BrowseLayout crumbs={[{ label: "Featured Products" }]} title="Featured Products" featuredOnly />
    </Suspense>
  );
}
