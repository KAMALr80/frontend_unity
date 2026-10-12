import type { Metadata } from "next";
import { StaticContentPage } from "@/components/shared/StaticContentPage";
import { getSiteSettings } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: "About Us",
    description: `Who we are: ${site.site_name ?? "our company"}, a wholesale distributor serving service businesses.`,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const site = await getSiteSettings();
  const phoneHref = site.phone ? `tel:${site.phone.replace(/[^+\d]/g, "")}` : null;
  return (
    <StaticContentPage eyebrow="About us" title={site.site_name ?? "About us"}>
      <p>We serve licensed retail buyers with a broad wholesale catalog and account-based pricing.</p>
      <h2>Wholesale support</h2>
      <p>Our team helps approved buyers navigate products, catalog availability, ordering, and account questions.</p>
      {(site.email || site.phone) && (
        <p>
          Contact us
          {site.email && <> at <a href={`mailto:${site.email}`}>{site.email}</a></>}
          {site.phone && phoneHref && <> or <a href={phoneHref}>{site.phone}</a></>}.
        </p>
      )}
      {site.address && <p className="whitespace-pre-line">{site.address}</p>}
    </StaticContentPage>
  );
}
