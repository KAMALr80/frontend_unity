"use client";

import { useSiteConfig } from "@/context/SiteConfigContext";

interface Feature {
  title?: string;
  text?: string;
}

/** Brand side of the login/register cards. All copy comes from the homepage CMS (site name, notice heading, selling points). */
export function AuthBrandPanel() {
  const { homepage, site } = useSiteConfig();
  const sections = homepage?.sections ?? [];
  const notice = sections.find((section) => section.type === "notice")?.title;
  const features = (sections.find((section) => section.type === "feature_list")?.settings.features ?? []) as Feature[];

  return (
    <div className="relative z-10 space-y-4">
      {site.site_name && <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gold">{site.site_name}</div>}
      {notice && <h2 className="text-[22px] font-semibold leading-tight tracking-tight text-white">{notice}</h2>}
      {features.length > 0 && (
        <ul className="space-y-2.5">
          {features.filter((feature) => feature.title).map((feature) => (
            <li key={feature.title} className="flex items-start gap-2 text-[12px] text-neutral-400">
              <span className="mt-0.5 shrink-0 text-gold" aria-hidden="true">✓</span>
              <span><strong className="font-semibold text-neutral-200">{feature.title}</strong>{feature.text ? ` — ${feature.text}` : ""}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
