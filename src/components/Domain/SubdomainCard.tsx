"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useCreateSubdomain, useDeleteSubdomain, useUpdateSubdomain } from "@/hooks/queryHooks/useSchool";
import { canManageDomain } from "@/lib/permissions/domain";
import { getApiErrorMessage } from "@/lib/apiError";

const SUBDOMAIN_LABEL_REGEX = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

interface SubdomainCardProps {
  subdomain: string | null;
  // A connected custom domain is served from this subdomain, so it can be changed but not deleted.
  hasConnectedDomain: boolean;
}

export const SubdomainCard = ({ subdomain, hasConnectedDomain }: SubdomainCardProps) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(subdomain ?? "");
  const { mutate: createSubdomain, isPending: isCreating } = useCreateSubdomain();
  const { mutate: updateSubdomain, isPending: isUpdating } = useUpdateSubdomain();
  const { mutate: deleteSubdomain, isPending: isDeleting } = useDeleteSubdomain();

  const label = value.trim().toLowerCase();
  const isValid = SUBDOMAIN_LABEL_REGEX.test(label);
  const isPending = isCreating || isUpdating;
  const showInput = !subdomain || editing;

  const handleSave = () => {
    if (!isValid) return;
    const options = {
      onSuccess: () => {
        toast.success(subdomain ? "Subdomain updated" : "Subdomain saved");
        setEditing(false);
      },
      onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not save the subdomain. Please try again.")),
    };
    if (subdomain) updateSubdomain({ subdomain: label }, options);
    else createSubdomain({ subdomain: label }, options);
  };

  const handleDelete = () => {
    deleteSubdomain(undefined, {
      onSuccess: () => {
        toast.success("Subdomain deleted");
        setValue("");
      },
      // SUBDOMAIN_IN_USE carries a message written for display.
      onError: (error: unknown) => toast.error(getApiErrorMessage(error, "Could not delete the subdomain. Please try again.")),
    });
  };

  return (
    <div className="border-border-default flex flex-col gap-3 rounded-lg border p-4">
      <p className="text-text-default text-sm font-medium">Your school&apos;s subdomain</p>
      {showInput ? (
        <>
          {!subdomain && <p className="text-text-muted text-xs">Choose a subdomain before connecting a domain. Your website is served from it.</p>}
          <div className="flex max-w-100 flex-col gap-2">
            <Input value={value} onChange={e => setValue(e.target.value)} placeholder="yourschool" />
            {label.length > 0 && !isValid && <p className="text-text-danger text-xs">Use letters, numbers and hyphens only, e.g. yourschool</p>}
            <PermissionCheck permissionUtility={canManageDomain}>
              <div className="flex gap-2">
                <Button
                  disabled={!isValid || isPending}
                  onClick={handleSave}
                  className="bg-bg-state-primary! text-text-white-default! h-8 px-4 text-xs"
                >
                  {isPending && <Spinner className="size-3" />}
                  Save subdomain
                </Button>
                {subdomain && (
                  <Button variant="outline" className="border-border-default! h-8 px-4 text-xs" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                )}
              </div>
            </PermissionCheck>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-between gap-3">
          <p className="text-text-default font-mono text-sm">{subdomain}</p>
          <PermissionCheck permissionUtility={canManageDomain}>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-border-default! h-8 px-4 text-xs"
                onClick={() => {
                  setValue(subdomain ?? "");
                  setEditing(true);
                }}
              >
                Change
              </Button>
              {!hasConnectedDomain && (
                <Button variant="outline" className="border-border-default! h-8 px-4 text-xs" disabled={isDeleting} onClick={handleDelete}>
                  {isDeleting && <Spinner className="size-3" />}
                  Delete
                </Button>
              )}
            </div>
          </PermissionCheck>
        </div>
      )}
    </div>
  );
};
