import { SITE_URL } from "@/lib/site";

/**
 * Structured data (schema.org JSON-LD) in the server-rendered HTML. `<` is escaped so text from the CMS or the
 * catalogue can never close the script tag.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\u003c") }} />;
}

/** BreadcrumbList for the trail shown on the page. The last crumb is the page itself (no link of its own). */
export function breadcrumbList(crumbs: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      ...(crumb.path ? { item: `${SITE_URL}${crumb.path}` } : {}),
    })),
  };
}
