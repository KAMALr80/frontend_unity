"use client";

import { Send } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";

/** Newsletter sign-up band at the top of the footer. Text comes from the site settings. */
export function NewsletterBar() {
  const { site } = useSiteConfig();
  if (!site.newsletter_enabled || !site.newsletter_title) return null;
  return (
    <section className="border-b border-white/10 bg-black px-4 py-5 sm:px-8" aria-label={site.newsletter_title}>
      <div className="mx-auto flex max-w-[1600px] flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between md:gap-10">
        <div className="flex shrink-0 items-center gap-3 text-white">
          <Send size={20} strokeWidth={1.6} className="text-gold" aria-hidden="true" />
          <h2 className="text-sm font-bold sm:text-base">{site.newsletter_title}</h2>
        </div>
        <form className="flex w-full max-w-2xl overflow-hidden bg-white focus-within:ring-2 focus-within:ring-gold/60" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="newsletter-email" className="sr-only">Email address</label>
          <input id="newsletter-email" name="email" type="email" required placeholder={site.newsletter_placeholder} className="h-11 min-w-0 flex-1 bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground" />
          <button type="submit" className="min-w-24 shrink-0 bg-gold px-5 text-xs font-bold uppercase text-gold-foreground transition hover:brightness-95">{site.newsletter_button_text}</button>
        </form>
      </div>
    </section>
  );
}
