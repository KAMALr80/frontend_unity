import type { HomepageSection } from "@/context/SiteConfigContext";

/** Centered statement line (a CMS "notice" section: the title is the message). */
export function NoticeHeading({ section }: { section: HomepageSection }) {
  if (!section.title) return null;
  return (
    <section className="px-4 py-8 text-center sm:py-12">
      <h2 className="mx-auto max-w-4xl text-xl font-bold uppercase tracking-wide text-primary sm:text-3xl">{section.title}</h2>
    </section>
  );
}
