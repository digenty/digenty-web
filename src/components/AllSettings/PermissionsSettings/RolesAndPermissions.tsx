import { AddFill } from "@/components/Icons/AddFill";
import DeleteBin from "@/components/Icons/DeleteBin";
import Edit from "@/components/Icons/Edit";
import { SearchInput } from "@/components/SearchInput";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

const roles = [
  {
    id: 1,
    role: "Subject Teacher",
    users: 8,
  },
  {
    id: 2,
    role: "Class Teacher",
    users: 8,
  },
  {
    id: 3,
    role: "Accountant",
    users: 8,
  },
  {
    id: 4,
    role: "Branch Head",
    users: 8,
  },
];

export const RolesAndPermissions = () => {
  const router = useRouter();
  return (
    <div className="my-6 flex flex-col gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <SearchInput className="bg-bg-input-soft! wull border-none md:w-71" />

        <Button
          onClick={() => router.push("/settings/permissions/add-role")}
          className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8!"
        >
          <AddFill fill="var(--color-icon-white-default)" />
          Add Role{" "}
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {roles.map(rl => (
          <div key={rl.id} className="border-border-default flex items-center justify-between rounded-md border px-6 py-4">
            <div className="flex flex-col gap-1">
              <div className="text-text-default text-md font-medium">{rl.role}</div>
              <div className="text-text-muted text-xs">{rl.users} Users</div>
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
    </div>
  );
};
