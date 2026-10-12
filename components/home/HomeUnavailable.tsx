"use client";

import { useRouter } from "next/navigation";

/** Shown when the homepage API cannot be reached. Header and footer keep working; the user can retry. */
export function HomeUnavailable() {
  const router = useRouter();
  return (
    <section className="grid min-h-[420px] place-items-center bg-muted px-5 py-16">
      <div className="max-w-lg border border-border bg-card p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-destructive">Connection unavailable</p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">Storefront content could not be loaded</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Please try again in a moment.</p>
        <button type="button" onClick={() => router.refresh()} className="mt-6 bg-gold px-6 py-3 text-sm font-bold uppercase text-gold-foreground transition hover:brightness-95">Try again</button>
      </div>
    </section>
  );
}
