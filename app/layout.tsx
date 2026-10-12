import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { Providers } from "./providers";
import { SITE_URL, getHomepagePayload, getSiteSettings } from "@/lib/site";
import { cn } from "@/lib/utils";
import "./theme.css";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  display: "swap",
  subsets: ["latin"],
});

const geistHeading = Geist({
  variable: "--font-geist-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const configuredTheme = process.env.NEXT_PUBLIC_THEME?.trim();
const siteTheme = configuredTheme === "pallet" ? "pallet" : "forge";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  const siteName = site.site_name || "Unity Wholesale";
  const defaultTitle = site.seo_title || siteName;
  return {
    metadataBase: new URL(SITE_URL),
    // Child pages set a short title ("Shop", a product name, ...) and get " | Site name" appended.
    title: { default: defaultTitle, template: `%s | ${siteName}` },
    description: site.seo_description,
    applicationName: siteName,
    // The tab icon is the CMS logo (no icon files in the app folder).
    icons: site.logo_url ? { icon: [{ url: site.logo_url }], shortcut: [{ url: site.logo_url }], apple: [{ url: site.logo_url }] } : undefined,
    openGraph: {
      type: "website",
      siteName,
      title: defaultTitle,
      description: site.seo_description,
      images: site.logo_url ? [{ url: site.logo_url, alt: siteName }] : undefined,
    },
    twitter: { card: "summary", title: defaultTitle, description: site.seo_description },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const homepage = await getHomepagePayload();
  return (
    <html
      lang="en"
      data-theme={siteTheme}
      className={cn(
        roboto.variable,
        geistHeading.variable,
        geistMono.variable,
        "h-full font-sans antialiased",
      )}
    >
      <body className="min-h-full flex flex-col bg-brand-bg text-brand-ink">
        <Providers initialHomepage={homepage}>{children}</Providers>
      </body>
    </html>
  );
}
