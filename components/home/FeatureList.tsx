import { Clock, Phone, ShieldCheck, Store, Tag, Truck, type LucideIcon } from "lucide-react";
import type { HomepageSection } from "@/context/SiteConfigContext";

/** Icon keys the CMS can pick from (a fixed UI vocabulary, not content). */
const ICONS: Record<string, LucideIcon> = { truck: Truck, store: Store, clock: Clock, shield: ShieldCheck, tag: Tag, phone: Phone };

interface Feature {
  icon?: string;
  title?: string;
  text?: string;
}

/** Row of short selling points ("Same Day Shipping", ...) from a CMS feature_list section. */
export function FeatureList({ section }: { section: HomepageSection }) {
  const features = (Array.isArray(section.settings.features) ? section.settings.features : []).filter((feature: Feature) => feature?.title);
  if (features.length === 0) return null;
  return (
    <section className="border-y border-border bg-muted/60 px-3 py-6 sm:px-6" aria-label={section.title}>
      <ul className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-3 gap-y-6 lg:grid-cols-4 lg:divide-x lg:divide-border">
        {features.map((feature: Feature) => {
          const Icon = ICONS[feature.icon ?? ""] ?? Tag;
          return (
            <li key={feature.title} className="flex flex-col items-center gap-2 px-2 text-center sm:flex-row sm:justify-center sm:gap-4 sm:text-left">
              <Icon size={34} strokeWidth={1.25} className="shrink-0 text-gold" aria-hidden="true" />
              <p className="text-xs leading-snug text-muted-foreground sm:text-sm">
                <strong className="block text-sm font-bold text-foreground sm:text-base">{feature.title}</strong>
                {feature.text}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
