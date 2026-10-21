import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPublicWebsiteConfig } from "@/api/website";
import ComingSoonPage from "@/app/site/coming-soon/page";
import { WebsiteRenderer } from "@/components/WebsiteCustomization/preview/WebsiteRenderer";

// The [slug] segment only exists because middleware rewrites here — the actual lookup is by the
// original Host header (Next preserves it through an internal rewrite), not by this path segment.
export default async function PublicSitePage() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) notFound();

  try {
    const config = await getPublicWebsiteConfig(host);
    return <WebsiteRenderer dto={config} />;
  } catch {
    // resolve (cached ~60s) said the site was live but /public/website 404s: it has since been unpublished.
    return <ComingSoonPage />;
  }
}
