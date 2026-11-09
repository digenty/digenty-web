import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getPublicWebsiteConfig } from "@/api/website";
import ComingSoonPage from "@/app/site/coming-soon/page";
import { WebsiteRenderer } from "@/components/WebsiteCustomization/preview/WebsiteRenderer";
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
