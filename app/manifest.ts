import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/site";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const site = await getSiteSettings();
  const name = site.site_name || "Unity Wholesale";
  return {
    name,
    short_name: name,
    description: site.seo_description,
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    icons: site.logo_url ? [{ src: site.logo_url, sizes: "any" }] : [],
  };
}
