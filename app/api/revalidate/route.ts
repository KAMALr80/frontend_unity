import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { HOMEPAGE_TAG } from "@/lib/site";

/**
 * Called by the Gateway backend right after the homepage is changed in the admin (or imported), so the storefront
 * shows the change immediately instead of waiting for the 5 minute cache. Server-to-server only: it needs the shared
 * secret in REVALIDATE_SECRET (same value as FRONTEND_REVALIDATE_SECRET on the backend).
 */
export const dynamic = "force-dynamic";

function sameSecret(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected) return Response.json({ ok: false, message: "Revalidation is not configured." }, { status: 503 });
  if (!sameSecret(request.headers.get("x-revalidate-secret") ?? "", expected)) {
    return Response.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  revalidateTag(HOMEPAGE_TAG, { expire: 0 });
  revalidatePath("/", "layout");
  return Response.json({ ok: true, revalidated: ["homepage"] });
}
