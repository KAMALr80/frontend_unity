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
import { fetchApi, getHomepagePayload } from "@/lib/site";

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

  return (
    <HomeProductsProvider ids={productIds} initial={initialProducts}>
      {homepage.site.homepage_heading && <h1 className="sr-only">{homepage.site.homepage_heading}</h1>}
      {sections.map((section) => <Section key={section.id} section={section} catalogBackground={homepage.site.catalog_background_logo_url} />)}
    </HomeProductsProvider>
  );
}
