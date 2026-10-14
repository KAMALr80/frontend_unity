"use client";

import Image from "next/image";
import Link from "next/link";
import { useSiteConfig } from "@/context/SiteConfigContext";

interface LogoProps {
  /** Tailwind classes for the whole lockup (height of the icon). The icon is contained (never cropped or stretched). */
  className?: string;
  loading?: "eager" | "lazy";
}

/**
 * Brand lockup: the logo icon from the CMS next to the site name and tagline (also from the CMS).
 * Nothing here is hard-coded: with no icon only the text is shown, with no name only the icon.
 */
export function Logo({ className = "h-11 sm:h-14", loading = "lazy" }: LogoProps) {
  const { site } = useSiteConfig();
  if (!site.logo_url && !site.site_name) return null;
  return (
    <Link
      href="/"
      aria-label={`${site.site_name || "Website"} home`}
      className={`flex shrink-0 items-center gap-2.5 no-underline outline-none focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold/60 sm:gap-3 ${className}`}
    >
      {site.logo_url && (
        <span className="relative block aspect-square h-full shrink-0">
          <Image src={site.logo_url} alt="" fill sizes="80px" loading={loading} className="object-contain" />
        </span>
      )}
      {site.site_name && (
        <span className="flex min-w-0 flex-col justify-center leading-none text-gold">
          <span className="whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.08em] min-[400px]:text-[15px] min-[480px]:text-xl min-[480px]:tracking-[0.18em] sm:text-2xl">{site.site_name}</span>
          {site.site_tagline && <span className="mt-1 hidden whitespace-nowrap text-[8px] font-medium tracking-[0.12em] text-gold/90 sm:block sm:text-[9px]">{site.site_tagline}</span>}
        </span>
      )}
    </Link>
  );
}
