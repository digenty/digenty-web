import { ErrorComponent } from "@/components/Error/ErrorComponent";
import { Toggle } from "@/components/Toggle";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetPermissions } from "@/hooks/queryHooks/usePermission";
import { transformPermissions } from "../utils";

export const ModulePermission = ({ permissionIds, setPermissionIds }: { permissionIds: number[]; setPermissionIds: (ids: number[]) => void }) => {
  const { data, isPending, isError } = useGetPermissions();
  return (
    <div className="border-border-default my-6 flex w-full flex-col gap-4 rounded-md border p-4 md:p-6">
      <div className="flex flex-col gap-1">
        <div className="text-text-default text-lg font-semibold">Module Permissions</div>
        <div className="text-text-subtle text-sm">Configure access to standard system modules</div>
      </div>

      {isError && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent
            title="Could not get Permissions"
            description="This is our problem, we are looking into it so as to serve you better"
            buttonText="Go to the Home page"
          />
        </div>
      )}
      {isPending && <Skeleton className="bg-bg-input-soft h-100 w-full" />}

      {!isPending && !isError && data?.data?.content?.length === 0 && (
        <div className="flex h-80 items-center justify-center">
          <ErrorComponent title="No Permissions" description="No permission yet" buttonText="" />
        </div>
      )}

      {!isPending &&
        !isError &&
        data?.data?.content?.length > 0 &&
        transformPermissions(data?.data?.content).map(permission => (
          <div
            key={permission.title}
            className="border-border-default flex flex-col gap-4 rounded-md border p-2 md:flex-row md:items-center md:justify-between md:gap-2 md:p-4"
          >
            <div className="flex items-center gap-4">
              <div className="bg-bg-state-soft-hover rounded-sm p-1">
                <permission.icon fill="var(--color-icon-default-subtle)" className="size-4.5" />
              </div>
              <div className="flex flex-col">
                <div className="text-text-default text-sm font-medium">{permission.title}</div>
                <div className="text-text-muted text-xs">{permission.description}</div>
              </div>
            </div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              {permission.actions.map(action => (
                <div key={action.id} className="flex items-center gap-3">
                  <Toggle
                    withBorder={false}
                    checked={permissionIds.includes(action.id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setPermissionIds([...permissionIds, action.id]);
                      } else {
                        setPermissionIds(permissionIds.filter(id => id !== action.id));
                      }
                    }}
                  />
                  <div className="flex items-center gap-1.5">
                    <action.icon fill="var(--color-icon-default-muted)" className="size-4" />
                    <div className="text-text-muted text-sm">{action.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};
