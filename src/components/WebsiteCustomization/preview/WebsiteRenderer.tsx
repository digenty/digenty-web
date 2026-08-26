import { WebsiteConfigDto } from "@/api/website";
import { dtoToConfig } from "../mapping";
import { WebsitePreview } from "./WebsitePreview";

// The one branch that decides how a site renders, shared by the staff preview route and the
// public site route so they never drift apart: customHtml is an override, not a fallback.
export const WebsiteRenderer = ({ dto }: { dto: WebsiteConfigDto }) => {
  // customHtml is a deliberate raw-HTML override the school authored — see api/website.ts.
  if (dto.customHtml) {
    return <div className="w-full" dangerouslySetInnerHTML={{ __html: dto.customHtml }} />;
  }

  // Both callers of WebsiteRenderer (the staff preview tab and the public /site/[slug] route)
  // are standalone pages, not the embedded editor panel — links should actually navigate.
  return <WebsitePreview config={dtoToConfig(dto)} interactive />;
};
