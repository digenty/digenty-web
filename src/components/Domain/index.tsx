"use client";

import { useCreateSubdomain, useGetSchoolDetails } from "@/hooks/queryHooks/useSchool";
import { cn } from "@/lib/utils";
import { AlertCircle, ChevronDown, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

function toHostnameFormats(schoolName: string): string[] {
  const cleaned = schoolName
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim();

  const words = cleaned.split(/\s+/).filter(Boolean);

  const candidates = [
    words.join(""),
    words.join("-"),
    words[0],
    words.map(w => w[0]).join(""),
    words.slice(0, 2).join(""),
    words.slice(0, 2).join("-"),
  ];

  return [...new Set(candidates)].filter(s => s && s.length > 1);
}

type DomainCardProps = { domain: string; slug: string; primary?: boolean; onSelect: (slug: string) => void; isPending?: boolean };

const DomainCard = ({ domain, slug, primary, onSelect, isPending }: DomainCardProps) => (
  <div className="flex items-center justify-between px-4 py-3">
    <div className="flex items-center gap-3">
      <Globe className="size-5 shrink-0 text-blue-500" />
      <span className="text-text-default text-sm font-medium">{domain}</span>
    </div>
    <Button
      variant={primary ? "default" : "outline"}
      disabled={isPending}
      onClick={() => onSelect(slug)}
      className={cn(
        "border-border-default! h-8 border px-4 text-xs",
        primary && "bg-bg-state-primary! text-text-white-default! hover:bg-bg-state-primary-hover!",
      )}
    >
      Select
    </Button>
  </div>
);

export const DomainMain = () => {
  const { data: schoolResponse } = useGetSchoolDetails();
  const schoolName = schoolResponse?.data?.schoolName ?? "";
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { mutate: createSubdomain, isPending } = useCreateSubdomain();

  useBreadcrumb([{ label: "Domain", url: "/staff/domain" }]);

  const formats = toHostnameFormats(schoolName);
  const hasSearch = search.trim().length > 0;

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <h2 className="text-text-default text-xl font-semibold">Domain</h2>

      <div className="border-border-default bg-bg-badge-blue flex items-center gap-3 rounded-lg border p-4">
        <Globe className="text-text-muted size-5 shrink-0" />
        <div className="flex flex-col gap-0.5">
          <p className="text-text-default text-sm font-medium">You do not have a domain yet</p>
          <p className="text-text-muted text-xs">To continue, search and purchase your preferred domain</p>
        </div>
      </div>

      <div className="border-bg-basic-lime-accent bg-bg-basic-lime-subtle flex flex-col items-center justify-center gap-3 rounded-xl border px-6 py-10">
        <p className="text-text-subtle text-xs">Every great idea starts with a name!</p>
        <p className="text-text-default text-base font-semibold">Search up a domain</p>
        <div className="border-border-default bg-bg-default flex items-center overflow-hidden rounded-md border">
          <span className="border-border-default text-text-muted border-r px-3 py-2 text-sm">www.</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Enter your preferred domain"
            className="text-text-default placeholder:text-text-hint h-9 flex-1 bg-transparent px-3 text-sm outline-none"
          />
          <Button className="bg-bg-state-primary! text-text-white-default! hover:bg-bg-state-primary-hover! m-1 h-7 rounded-md text-xs font-medium">
            Search
          </Button>
        </div>
      </div>

      {(hasSearch || formats.length > 0) && (
        <div className="flex flex-col gap-3">
          {hasSearch && (
            <>
              {/* <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
                <AlertCircle className="mt-0.5 size-5 shrink-0 text-orange-500" />
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-orange-700">Domain Unavailable</p>
                  <p className="text-xs text-orange-600">{search}.axisbydigenty.com is available for transfer</p>
                </div>
              </div> */}

              <div className="border-border-default rounded-lg border">
                <DomainCard
                  domain={`${search.trim()}.axisbydigenty.com`}
                  slug={search.trim()}
                  primary
                  onSelect={slug => createSubdomain({ subdomain: slug })}
                  isPending={isPending}
                />
              </div>
            </>
          )}

          {formats.length > 0 && (
            <div className="border-border-default rounded-xl border">
              <button onClick={() => setShowSuggestions(prev => !prev)} className="flex w-full items-center justify-between px-4 py-3">
                <span className="text-text-default text-sm font-semibold">Suggested Domains</span>
                <ChevronDown className={cn("text-text-muted size-4 transition-transform duration-200", showSuggestions && "rotate-180")} />
              </button>

              {showSuggestions && (
                <div className="divide-border-default border-border-default divide-y border-t">
                  {formats.map(slug => (
                    <DomainCard
                      key={slug}
                      domain={`${slug}.axisbydigenty.com`}
                      slug={slug}
                      onSelect={slug => createSubdomain({ subdomain: slug })}
                      isPending={isPending}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
