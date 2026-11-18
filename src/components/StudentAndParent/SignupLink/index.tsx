"use client";

import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { PermissionCheck } from "@/components/ModulePermissionsWrapper/PermissionCheck";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { useCreateSignupLink, useGetSignupLink, useSetSignupLinkActive } from "@/hooks/queryHooks/useSignupLink";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getApiErrorReason } from "@/lib/apiError";
import { canManageStudentParentRecords } from "@/lib/permissions/students-and-parents";
import { Copy, Link2, RefreshCw } from "lucide-react";
import { useState } from "react";

const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API is unavailable on insecure origins / some webviews — fall back to a hidden textarea.
    try {
      const el = document.createElement("textarea");
      el.value = text;
      el.style.position = "fixed";
      el.style.opacity = "0";
      document.body.appendChild(el);
      el.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(el);
      return ok;
    } catch {
      return false;
    }
  }
};

export const SignupLinkButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <PermissionCheck permissionUtility={canManageStudentParentRecords}>
      <Button
        onClick={() => setOpen(true)}
        className="border-border-darker text-text-default bg-bg-state-secondary hover:bg-bg-state-secondary-hover! flex w-fit shrink-0 items-center gap-1.5 border text-sm font-medium"
      >
        <Link2 className="size-4" />
        Parent signup link
      </Button>
      <SignupLinkDialog open={open} setOpen={setOpen} />
    </PermissionCheck>
  );
};

const SignupLinkDialog = ({ open, setOpen }: { open: boolean; setOpen: (b: boolean) => void }) => {
  const isMobile = useIsMobile();
  if (!open) return null;

  const title = "Parent signup link";
  const content = <SignupLinkContent />;

  return !isMobile ? (
    <Modal open={open} setOpen={setOpen} title={title} showFooter={false} className="max-w-130!">
      {content}
    </Modal>
  ) : (
    <MobileDrawer open={open} setIsOpen={setOpen} title={title}>
      {content}
    </MobileDrawer>
  );
};

const SignupLinkContent = () => {
  const { data: link, isPending, isError, error, refetch } = useGetSignupLink();
  const { mutate: createLink, isPending: creating } = useCreateSignupLink();
  const { mutate: setActive, isPending: togglingActive } = useSetSignupLinkActive();
  const [confirmRegenerate, setConfirmRegenerate] = useState(false);

  const handleCreate = (regenerating: boolean) => {
    createLink(undefined, {
      onSuccess: () => {
        setConfirmRegenerate(false);
        toast({
          title: regenerating ? "New link generated" : "Signup link created",
          description: regenerating ? "The previous link no longer works." : undefined,
          type: "success",
        });
      },
      onError: err => {
        toast({
          title: regenerating ? "Could not regenerate the link" : "Could not create the link",
          description: getApiErrorReason(err),
          type: "error",
        });
      },
    });
  };

  const handleCopy = async () => {
    if (!link) return;
    const ok = await copyText(link.url);
    toast(
      ok
        ? { title: "Link copied", description: "Share it with parents so they can sign up.", type: "success" }
        : { title: "Could not copy the link", description: "Select the link and copy it manually.", type: "error" },
    );
  };

  const handleToggle = (active: boolean) => {
    setActive(active, {
      onSuccess: () => {
        toast({
          title: active ? "Signup link turned on" : "Signup link turned off",
          description: active ? undefined : "Parents can't sign up with this link until you turn it back on.",
          type: "success",
        });
      },
      onError: err => {
        toast({
          title: active ? "Could not turn the link on" : "Could not turn the link off",
          description: getApiErrorReason(err),
          type: "error",
        });
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-10">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 p-4">
        <p className="text-text-destructive text-sm">Could not load your signup link.</p>
        {getApiErrorReason(error) && <p className="text-text-muted text-sm">{getApiErrorReason(error)}</p>}
        <Button onClick={() => refetch()} className="bg-bg-state-secondary text-text-default border-border-darker border">
          Try again
        </Button>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <p className="text-text-muted text-sm leading-5">
          Share one link with your parents so they can create an account for your school. Use it if your school hasn&apos;t connected its own domain.
        </p>
        <Button
          onClick={() => handleCreate(false)}
          disabled={creating}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default w-fit"
        >
          {creating && <Spinner className="text-text-white-default" />}
          Create signup link
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <p className="text-text-muted text-sm leading-5">
        Share this link with parents so they can create an account for your school. Returning parents log in from the same address.
      </p>

      <div className="flex items-center gap-2">
        <Input
          readOnly
          value={link.url}
          onFocus={e => e.currentTarget.select()}
          className="text-text-muted bg-bg-input-soft! flex-1 rounded-lg border-none text-sm"
        />
        <Button onClick={handleCopy} className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default shrink-0">
          <Copy className="size-4" />
          Copy
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-text-default text-sm font-medium">Allow signups with this link</p>
          <p className="text-text-muted text-xs">{link.active ? "On — parents can sign up." : "Off — the link is disabled."}</p>
        </div>
        <div className="flex items-center gap-2">
          {togglingActive && <Spinner className="size-4" />}
          <Switch checked={link.active} disabled={togglingActive} onCheckedChange={handleToggle} />
        </div>
      </div>

      <div className="border-border-default border-t pt-4">
        {!confirmRegenerate ? (
          <Button onClick={() => setConfirmRegenerate(true)} className="bg-bg-state-secondary text-text-default border-border-darker border">
            <RefreshCw className="size-4" />
            Generate a new link
          </Button>
        ) : (
          <div className="flex flex-col gap-3">
            <p className="text-text-default text-sm">
              The current link will stop working straight away. Anyone you already sent it to will need the new one.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => handleCreate(true)}
                disabled={creating}
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default"
              >
                {creating && <Spinner className="text-text-white-default" />}
                Yes, generate new link
              </Button>
              <Button
                onClick={() => setConfirmRegenerate(false)}
                disabled={creating}
                className="bg-bg-state-secondary text-text-default border-border-darker border"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
