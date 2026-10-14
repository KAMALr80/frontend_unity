import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "Our best-selling wholesale products.",
  alternates: { canonical: "/best-sellers" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
