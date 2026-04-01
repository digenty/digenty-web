"use client";

import { BranchWithClassLevels } from "@/api/types";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Spinner } from "@/components/ui/spinner";
import { useGetBranches } from "@/hooks/queryHooks/useBranch";
import { useMakeBranchAdminStaff } from "@/hooks/queryHooks/useStaff";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useStaffStore } from "@/store/staff";
import { useState } from "react";

export const MakeBranchAdminModal = () => {
  const isMobile = useIsMobile();
  const { openMakeBranchAdmin, setOpenMakeBranchAdmin, staffToMakeAdmin } = useStaffStore();
  const { data: branchesData, isPending: loadingBranches } = useGetBranches();
  const { mutate, isPending: submitting } = useMakeBranchAdminStaff();
  const [selectedBranchIds, setSelectedBranchIds] = useState<number[]>([]);

  const branches = branchesData?.data || [];

  const handleToggleBranch = (branchId: number) => {
    setSelectedBranchIds(prev => (prev.includes(branchId) ? prev.filter(id => id !== branchId) : [...prev, branchId]));
  };

  const handleSubmit = () => {
    if (!staffToMakeAdmin) return;
    if (selectedBranchIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one branch",
        type: "error",
      });
      return;
    }

    mutate(
      {
        staffId: staffToMakeAdmin.staffId,
        branchIds: selectedBranchIds,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success",
            description: "Staff has been assigned as branch admin successfully",
            type: "success",
          });
          setOpenMakeBranchAdmin(false);
          setSelectedBranchIds([]);
        },
        onError: error => {
          toast({
            title: "Error",
            description: error?.message || "Failed to make staff branch admin",
            type: "error",
          });
        },
      },
    );
  };

  const content = (
    <div className="flex flex-col gap-6 px-6 py-3">
      <div className="flex flex-col gap-2">
        <p className="text-text-subtle text-sm">Select one or more branches where {staffToMakeAdmin?.fullName} will have admin permissions.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {loadingBranches ? (
          <Spinner />
        ) : (
          branches.map((branchWrapper: BranchWithClassLevels) => {
            const branch = branchWrapper.branch;
            return (
              <div
                key={branch.id}
                role="button"
                onClick={() => handleToggleBranch(branch.id)}
                className="bg-bg-card border-border-darker flex min-w-45 cursor-pointer items-center gap-2 rounded-md border px-3 py-2"
              >
                <Checkbox checked={selectedBranchIds.includes(branch.id)} onCheckedChange={() => handleToggleBranch(branch.id)} />
                <div className="text-text-default text-xs font-medium">{branch.name}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <>
      {openMakeBranchAdmin && (
        <>
          {!isMobile ? (
            <Modal
              title="Make Branch Admin"
              open={openMakeBranchAdmin}
              setOpen={setOpenMakeBranchAdmin}
              ActionButton={
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default! h-7!"
                >
                  {submitting && <Spinner className="text-text-white-default" />}
                  Save Changes
                </Button>
              }
            >
              {content}
            </Modal>
          ) : (
            <MobileDrawer open={openMakeBranchAdmin} setIsOpen={setOpenMakeBranchAdmin} title="Make Branch Admin">
              {content}
              <DrawerFooter className="border-border-default border-t">
                <div className="flex justify-between">
                  <DrawerClose asChild>
                    <Button className="bg-bg-state-soft text-text-subtle h-7! rounded-md! px-4 py-2 text-sm font-medium">Cancel</Button>
                  </DrawerClose>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-bg-state-primary! hover:bg-bg-state-primary-hover! text-text-white-default h-7!"
                  >
                    {submitting && <Spinner className="text-text-white-default" />}
                    Save Changes
                  </Button>
                </div>
              </DrawerFooter>
            </MobileDrawer>
          )}
        </>
      )}
    </>
  );
};
