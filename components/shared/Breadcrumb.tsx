import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Keep the trail on one line (the last item is truncated) so a long name cannot change the height. */
  singleLine?: boolean;
}

export function Breadcrumb({ items, singleLine = false }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex items-center gap-x-2 gap-y-1 text-[11px] font-medium uppercase tracking-[0.06em] text-muted-foreground ${singleLine ? "overflow-hidden whitespace-nowrap" : "flex-wrap"}`}>
        {items.map((item, i) => (
          <li key={i} className={`flex items-center gap-2 ${singleLine ? (i === items.length - 1 ? "min-w-0" : "shrink-0") : ""}`}>
            {i > 0 && <span className="text-border">/</span>}
            {item.href ? (
              <Link href={item.href} className="inline-flex min-h-6 items-center transition-colors hover:text-primary">
                {item.label}
              </Link>
            ) : (
              <span className={`text-foreground ${singleLine ? "truncate" : ""}`}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
