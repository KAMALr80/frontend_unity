import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Featured Products",
  description: "Hand-picked featured products from our wholesale catalog.",
  alternates: { canonical: "/featured" },
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
