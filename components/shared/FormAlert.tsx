import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

/**
 * Error notice for forms. The tint is only a hint: the message itself uses the normal foreground colour, so it
 * stays readable on any theme (red text on a red background is what this replaces). The icon carries the colour.
 */
export function FormAlert({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div role="alert" className={`flex items-start gap-2.5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-[13px] leading-snug text-foreground ${className}`}>
      <AlertCircle size={16} className="mt-px shrink-0 text-destructive" aria-hidden="true" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
