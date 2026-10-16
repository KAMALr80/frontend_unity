import type { Metadata } from "next";
import { StaticContentPage } from "@/components/shared/StaticContentPage";
import { getSiteSettings } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy", description: "How we collect, use and protect the information of our wholesale customers and website visitors.", alternates: { canonical: "/privacy-policy" } };

export default async function PrivacyPolicyPage() {
  const { email } = await getSiteSettings();
  return (
    <StaticContentPage eyebrow="Legal" title="Privacy Policy">
      <p><strong>Last updated:</strong> September 16, 2026</p>
      <h2>Information we collect</h2>
      <p>We collect account, business, contact, delivery, and order information needed to operate our wholesale service. We may also collect technical information required for security and service reliability.</p>
      <h2>How we use information</h2>
      <p>Information is used to review wholesale applications, provide account access, fulfill orders, support customers, prevent abuse, and meet legal obligations.</p>
      <h2>Sharing and retention</h2>
      <p>We share information only with service providers and authorities when necessary to operate the service or comply with law. Records are retained only as long as required for business and legal purposes.</p>
      <h2>Your choices</h2>
      <p>For access, correction, deletion, or privacy questions, contact {email ? <a href={`mailto:${email}`}>{email}</a> : "our team"}.</p>
      <p><strong>This policy should be reviewed by qualified legal counsel before production use.</strong></p>
    </StaticContentPage>
  );
}
