import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PRIVATE_PAGE_ROBOTS } from "@/lib/site";

export const metadata: Metadata = { title: "Reset Password", robots: PRIVATE_PAGE_ROBOTS };

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
