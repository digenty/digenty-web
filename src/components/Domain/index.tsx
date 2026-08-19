"use client";

import { useCreateSubdomain, useGetSchoolDetails, useGetSubdomain, useUpdateSubdomain } from "@/hooks/queryHooks/useSchool";
import { cn } from "@/lib/utils";
import { ChevronDown, Globe, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/Modal";
import { MobileDrawer } from "@/components/MobileDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";
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

const AddExistingDomainModal = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  const isMobile = useIsMobile();
  const [existingDomain, setExistingDomain] = useState("");

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) setExistingDomain("");
    setOpen(nextOpen);
  };

  const handleConnect = () => {
    toast.success("Domain request submitted");
    handleClose(false);
  };

  const formFields = (
    <div className="flex flex-col gap-2 p-4">
      <label htmlFor="existing-domain" className="text-text-default text-sm font-medium">
        Domain name
      </label>
      <Input id="existing-domain" value={existingDomain} onChange={e => setExistingDomain(e.target.value)} placeholder="e.g. www.yourschool.com" />
      <p className="text-text-muted text-xs">Enter a domain you already own. We&apos;ll guide you through connecting it afterwards.</p>
    </div>
  );

  const connectButton = (
    <Button
      disabled={!existingDomain.trim()}
      onClick={handleConnect}
      className="bg-bg-state-primary! text-text-white-default! hover:bg-bg-state-primary-hover! h-8 px-4 text-xs"
    >
      Connect domain
    </Button>
  );

  if (isMobile) {
    return (
      <MobileDrawer open={open} setIsOpen={handleClose} title="Add an existing domain">
        {formFields}
        <div className="border-border-default flex items-center justify-end border-t p-4">{connectButton}</div>
      </MobileDrawer>
    );
  }

  return (
    <Modal open={open} setOpen={handleClose} title="Add an existing domain" ActionButton={connectButton}>
      {formFields}
    </Modal>
  );
};

export const DomainMain = () => {
  const { data: schoolResponse } = useGetSchoolDetails();
  const { data: subdomainResponse } = useGetSubdomain();
  const schoolName = schoolResponse?.data?.schoolName ?? "";
  const currentSubdomain = subdomainResponse?.data?.subdomain;
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddExistingDomain, setShowAddExistingDomain] = useState(false);
  const { mutate: createSubdomain, isPending: isCreating } = useCreateSubdomain();
  const { mutate: updateSubdomain, isPending: isUpdating } = useUpdateSubdomain();
  const isPending = isCreating || isUpdating;

  useBreadcrumb([{ label: "Domain", url: "/staff/domain" }]);

  const formats = toHostnameFormats(schoolName);
  const hasSearch = search.trim().length > 0;
  const showSearchFlow = !currentSubdomain || isEditing;

  const handleSelect = (slug: string) => {
    if (currentSubdomain) {
      updateSubdomain(
        { subdomain: slug },
        {
          onSuccess: () => {
            toast.success("Domain updated successfully");
            setSearch("");
            setIsEditing(false);
          },
          onError: (error: unknown) => {
            toast.error((error as { message?: string })?.message ?? "Failed to update domain");
          },
        },
      );
      return;
    }

    createSubdomain(
      { subdomain: slug },
      {
        onSuccess: () => {
          toast.success("Domain created successfully");
          setSearch("");
        },
        onError: (error: unknown) => {
          toast.error((error as { message?: string })?.message ?? "Failed to create domain");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-text-default text-xl font-semibold">Domain</h2>
        {showSearchFlow && (
          <Button variant="outline" className="border-border-default! h-8 gap-1.5 px-4 text-xs" onClick={() => setShowAddExistingDomain(true)}>
            <Plus className="size-3.5" />
            Add existing domain
          </Button>
        )}
      </div>

      <AddExistingDomainModal open={showAddExistingDomain} setOpen={setShowAddExistingDomain} />

      {!showSearchFlow ? (
        <div className="border-border-default bg-bg-badge-blue flex items-center justify-between gap-3 rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Globe className="text-text-muted size-5 shrink-0" />
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <p className="text-text-default text-sm font-medium">Your domain is live</p>
                <span className="relative flex size-2">
                  <span className="bg-bg-basic-lime-accent absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                  <span className="bg-bg-basic-lime-accent relative inline-flex size-2 rounded-full" />
                </span>
              </div>
              <p className="text-text-muted text-xs">{currentSubdomain}.axisbydigenty.com</p>
            </div>
          </div>
          <Button variant="outline" className="border-border-default! h-8 px-4 text-xs" onClick={() => setIsEditing(true)}>
            Change domain
          </Button>
        </div>
      ) : (
        <>
          <div className="border-border-default bg-bg-badge-blue flex items-center justify-between gap-3 rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <Globe className="text-text-muted size-5 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <p className="text-text-default text-sm font-medium">{currentSubdomain ? "Update your domain" : "You do not have a domain yet"}</p>
                <p className="text-text-muted text-xs">To continue, search and purchase your preferred domain</p>
              </div>
            </div>
            {currentSubdomain && (
              <Button variant="outline" className="border-border-default! h-8 px-4 text-xs" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            )}
          </div>

          <div className="border-bg-basic-lime-accent bg-bg-basic-lime-subtle flex flex-col items-center justify-center gap-3 rounded-xl border px-6 py-10">
            <p className="text-text-subtle text-xs">Every great idea starts with a name!</p>
            <p className="text-text-default text-base font-semibold">Search up a domain</p>
            <div className="border-border-default bg-bg-default flex w-full max-w-100 items-center overflow-hidden rounded-md border">
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
                <div className="border-border-default rounded-lg border">
                  <DomainCard
                    domain={`${search.trim()}.axisbydigenty.com`}
                    slug={search.trim()}
                    primary
                    onSelect={handleSelect}
                    isPending={isPending}
                  />
                </div>
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
                        <DomainCard key={slug} domain={`${slug}.axisbydigenty.com`} slug={slug} onSelect={handleSelect} isPending={isPending} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
