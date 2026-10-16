import { type ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

interface PageHeaderProps {
  crumbs?: BreadcrumbItem[];
  title: string;
  accent?: string;
  meta?: string;
  actions?: ReactNode;
  /** 2 when the page already has its own H1 (e.g. the brand hero), so a page keeps a single H1. */
  headingLevel?: 1 | 2;
}

export function PageHeader({ crumbs, title, accent, meta, actions, headingLevel = 1 }: PageHeaderProps) {
  const Heading = headingLevel === 2 ? "h2" : "h1";
  return (
    <div className="border-b border-border bg-background px-4 py-4 md:px-6 md:py-5 lg:px-8">
      <div className="flex items-baseline justify-between gap-4 flex-wrap max-w-7xl mx-auto">
        <div className="flex items-baseline gap-4 flex-wrap">
          {crumbs && crumbs.length > 0 && <Breadcrumb items={crumbs} />}
          <Heading className="m-0 font-heading text-[26px] font-semibold leading-tight tracking-tight text-foreground md:text-[32px] lg:text-[36px] lg:leading-none">
            {title}
            {accent && (
              <em className="text-primary not-italic"> {accent}</em>
            )}
          </Heading>
          {meta && (
            <span className="inline-block min-w-[11rem] font-mono text-[11px] tracking-[0.04em] text-muted-foreground">
              {meta}
            </span>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
