import { BannerGrid } from "@/components/home/BannerGrid";
import { BrandStrip, CatalogSection, CategoryGrid } from "@/components/home/CmsSections";
import { FeatureList } from "@/components/home/FeatureList";
import { HeroSlider } from "@/components/home/HeroSlider";
import { HomeProductsProvider } from "@/components/home/HomeProducts";
import { HomeUnavailable } from "@/components/home/HomeUnavailable";
import { NoticeHeading } from "@/components/home/NoticeHeading";
import { ProductRail } from "@/components/home/ProductRail";
import type { HomepageSection } from "@/context/SiteConfigContext";
import { normalizeProduct, type ProductsResponse } from "@/hooks/useProducts";
import type { Metadata } from "next";
import { JsonLd } from "@/lib/jsonLd";
import { SITE_URL, fetchApi, getHomepagePayload } from "@/lib/site";

// Title and description come from the CMS (root layout); the homepage is the one canonical "/".
export const metadata: Metadata = { alternates: { canonical: "/" } };

function Section({ section, catalogBackground }: { section: HomepageSection; catalogBackground?: string | null }) {
  switch (section.type) {
    case "hero":
      return <HeroSlider section={section} />;
    case "banner":
      return <BannerGrid section={section} />;
    case "product_carousel":
      return <ProductRail section={section} />;
    case "feature_list":
      return <FeatureList section={section} />;
    case "notice":
      return <NoticeHeading section={section} />;
    case "featured_category":
      return <CategoryGrid section={section} />;
    case "brand_showcase":
      return <BrandStrip section={section} />;
    case "catalog_showcase":
      return <CatalogSection section={section} backgroundImage={catalogBackground} />;
    default:
      return null;
  }
}

export default async function HomePage() {
  // Same request the root layout makes; Next shares the result within one render.
  const homepage = await getHomepagePayload();
  if (!homepage) return <HomeUnavailable />;

  const sections = homepage.sections.filter((section) => section.is_active);
  const productIds = Array.from(new Set(sections.flatMap((section) => (section.type === "product_carousel" ? section.data?.product_ids ?? [] : []))));
  // One catalogue request for every carousel on the page (guest view; signed-in users refresh it in the browser).
  const catalogue = productIds.length > 0
    ? await fetchApi<ProductsResponse>(`/products?ids=${productIds.join(",")}&per_page=${productIds.length}`)
    : null;
  const initialProducts = (catalogue?.data ?? []).map(normalizeProduct);

  // Who the site belongs to and the site itself, only with details the CMS actually holds.
  const site = homepage.site;
  const siteName = site.site_name || "Unity Wholesale";
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: siteName,
    url: `${SITE_URL}/`,
    ...(site.logo_url ? { logo: site.logo_url } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.address ? { address: site.address.replace(/\s*\n\s*/g, ", ") } : {}),
  };
  const website = { "@context": "https://schema.org", "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: siteName, url: `${SITE_URL}/`, publisher: { "@id": `${SITE_URL}/#organization` } };

  return (
    <HomeProductsProvider ids={productIds} initial={initialProducts}>
      <JsonLd data={organization} />
      <JsonLd data={website} />
      {homepage.site.homepage_heading && <h1 className="sr-only">{homepage.site.homepage_heading}</h1>}
      {sections.map((section) => <Section key={section.id} section={section} catalogBackground={homepage.site.catalog_background_logo_url} />)}
    </HomeProductsProvider>
  );
}
