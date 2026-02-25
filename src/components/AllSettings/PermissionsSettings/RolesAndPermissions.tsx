import { Role } from "@/api/types";
import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { AddFill } from "@/components/Icons/AddFill";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRoles } from "@/hooks/queryHooks/useRole";
import useDebounce from "@/hooks/useDebounce";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export const RolesAndPermissions = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isPending, isError } = useGetRoles({
    search: debouncedSearchQuery,
  });

  return (
    <div className="my-6 flex flex-col gap-6">
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
                <Button className="hover:bg-bg-none! border-none bg-none!">
                  <DeleteBin fill="var(--color-icon-default-muted)" />
                </Button>
                <Button className="hover:bg-bg-none! border-none bg-none!">
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
