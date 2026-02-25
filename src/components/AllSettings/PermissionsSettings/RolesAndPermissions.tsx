import { Role } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import WarningIcon from "@/components/Icons/WarningIcon";
import { MobileDrawer } from "@/components/MobileDrawer";
import { Modal } from "@/components/Modal";
import { SearchInput } from "@/components/SearchInput";
import { toast } from "@/components/Toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogDescription } from "@/components/ui/dialog";
import { DrawerClose, DrawerFooter } from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useDeleteRole, useGetRoles } from "@/hooks/queryHooks/useRole";
import useDebounce from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/useIsMobile";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const RolesAndPermissions = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [roleId, setRoleId] = useState<number | undefined>(undefined);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isPending, isError } = useGetRoles(debouncedSearchQuery);
  const { mutate, isPending: deleting } = useDeleteRole(roleId);

  const deleteRole = () => {
    mutate(undefined, {
      onSuccess: data => {
        toast({
          title: "Deleted successfully",
          description: data.message,
          type: "success",
        });
        setRoleId(undefined);
        setDeleteModal(false);
      },
      onError: error => {
        toast({
          title: "Could not delete role",
          description: error.message,
          type: "error",
        });
      },
    });
  };

  return (
    <div className="my-6 flex flex-col gap-6">
      {deleteModal && (
        <>
          {isMobile ? (
            <MobileDrawer open={deleteModal} setIsOpen={setDeleteModal} title="Delete Role?">
              <div className="space-y-5 px-4 py-5">
                <DialogDescription className="text-text-subtle text-sm font-normal">
                  Are you sure you want to permanently delete this role? This action cannot be undone.
                </DialogDescription>

                <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle shadow-light flex items-center gap-3 rounded-lg border px-2.5 py-2.5 text-sm font-normal">
                  <WarningIcon className="size-10" />
                  <p>
                    Deleting will remove the role from your system. Staff currently assigned to it will lose this role immediately, but their profiles
                    will remain active.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox id="terms" checked={isChecked} onCheckedChange={(checked: boolean) => setIsChecked(checked)} />
                  <label htmlFor="terms" className="text-text-subtle text-sm font-normal">
                    I understand that deleting this role is permanent and cannot be undone.
                  </label>
                </div>
              </div>

              <DrawerFooter className="border-border-default border-t">
                <div className="flex justify-between">
                  <DrawerClose asChild>
                    <Button className="bg-bg-state-soft text-text-subtle h-7 rounded-md! px-2 py-2 text-sm font-medium">Cancel</Button>
                  </DrawerClose>

                  <Button
                    disabled={!isChecked}
                    onClick={deleteRole}
                    className={`h-7 rounded-md text-sm font-medium ${
                      isChecked
                        ? "bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover!"
                        : "bg-bg-state-soft text-text-subtle"
                    }`}
                  >
                    {deleting && <Spinner className="text-text-white-default" />}
                    Delete Role
                  </Button>
                </div>
              </DrawerFooter>
            </MobileDrawer>
          ) : (
            <Modal
              open={deleteModal}
              setOpen={setDeleteModal}
              title="Delete Role?"
              ActionButton={
                <Button
                  disabled={!isChecked}
                  onClick={deleteRole}
                  className={`h-7 rounded-md text-sm font-medium ${
                    isChecked
                      ? "bg-bg-state-destructive text-text-white-default hover:bg-bg-state-destructive-hover!"
                      : "bg-bg-state-soft text-text-subtle"
                  }`}
                >
                  {deleting && <Spinner className="text-text-white-default" />}
                  Delete Role
                </Button>
              }
            >
              <div className="space-y-5 px-6 py-5">
                <DialogDescription className="text-text-subtle text-sm font-normal">
                  Are you sure you want to permanently delete this role? This action cannot be undone.
                </DialogDescription>

                <div className="bg-bg-basic-orange-subtle border-border-default text-text-subtle shadow-light flex items-center gap-3 rounded-lg border px-2.5 py-2.5 text-sm font-normal">
                  <WarningIcon className="size-10" />
                  <p>
                    Deleting will remove the role from your system. Staff currently assigned to it will lose this role immediately, but their profiles
                    will remain active.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox id="terms" checked={isChecked} onCheckedChange={(checked: boolean) => setIsChecked(checked)} />
                  <label htmlFor="terms" className="text-text-subtle text-sm font-normal">
                    I understand that deleting this role is permanent and cannot be undone.
                  </label>
                </div>
              </div>
            </Modal>
          )}
        </>
      )}

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchInput
          className="bg-bg-input-soft! h-8 rounded-lg border-none md:w-70.5"
          value={searchQuery}
          onChange={evt => {
            setSearchQuery(evt.target.value);
          }}
        />

        <Button
          onClick={() => router.push("/settings/permissions/add-role")}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8! self-start"
        >
          <PlusIcon className="text-icon-white-default size-4" />
          Add Role{" "}
        </Button>
      </div>

      {isError && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get roles"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}
      {isPending && !data && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {!isPending && !isError && data?.data.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="No Roles created yet"
            description="No role has been created yet"
            buttonText="Add a role"
            url="/settings/permissions/add-role"
          />
        </div>
      )}

      {!isPending && !isError && data?.data.length > 0 && (
        <div className="flex flex-col gap-6">
          {data?.data.map((role: Role) => (
            <div key={role.roleName} className="border-border-default flex items-center justify-between rounded-lg border px-6 py-4">
              <div className="flex flex-col gap-1">
                <div className="text-text-default text-md font-medium">{role.roleName}</div>
                <div className="text-text-muted text-xs">
                  {role.totalUsers} User{role.totalUsers !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="flex items-center">
                <Button
                  onClick={() => {
                    setRoleId(role.roleId);
                    setDeleteModal(true);
                  }}
                  className="hover:bg-bg-none! border-none bg-none!"
                >
                  <DeleteBin fill="var(--color-icon-default-muted)" />
                </Button>
                <Button
                  onClick={() => router.push(`/settings/permissions/edit-role/${role.roleId}`)}
                  className="hover:bg-bg-none! border-none bg-none!"
                >
                  <Edit fill="var(--color-icon-default-muted)" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
