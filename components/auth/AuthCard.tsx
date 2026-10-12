import type { ReactNode } from "react";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { Logo } from "@/components/layout/Logo";

/** Two-panel card shared by the sign-in, forgot-password and reset-password pages. */
export function AuthCard({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-[900px] min-h-[480px] bg-card text-card-foreground flex overflow-hidden rounded-xl border border-border shadow-sm">
      <div className="hidden md:flex flex-col w-[280px] shrink-0 bg-neutral-950 p-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-primary opacity-90" />
        <div className="absolute right-14 bottom-8 w-20 h-20 rounded-full bg-primary/30" />
        <AuthBrandPanel />
      </div>
      <div className="flex-1 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10">
        <div className="mb-8"><Logo loading="eager" /></div>
        <div className="text-[10px] font-medium tracking-[0.1em] text-primary uppercase mb-2">{eyebrow}</div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground mb-1">{title}</h1>
        <p className="text-[13px] text-muted-foreground mb-6">{intro}</p>
        {children}
      </div>
    </div>
  );
}

export const AUTH_INPUT =
  "w-full h-10 rounded-md border border-input bg-background px-3 text-[14px] text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20";
export const AUTH_BUTTON =
  "w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-[13px] shadow-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2";
