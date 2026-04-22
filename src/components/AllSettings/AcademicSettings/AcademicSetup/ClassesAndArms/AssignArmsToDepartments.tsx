import { ArmDetails, DepartmentWithSubjects } from "@/api/types";
import { toast } from "@/components/Toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAssignArmToDepartment } from "@/hooks/queryHooks/useDepartment";
import { useState } from "react";

export const AssignArmsToDepartments = ({ arms, departments }: { arms: ArmDetails[]; departments: DepartmentWithSubjects[] }) => {
  console.log(arms, departments);
  if (!arms?.length || !departments?.length) return null;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-text-default text-xl font-semibold">Assign Arms to Departments</div>

      <div className="flex flex-col gap-6">
        {arms.map(arm => (
          <ArmDepartmentSelect key={arm.id} arm={arm} departments={departments} />
        ))}
      </div>
    </div>
  );
};

const ArmDepartmentSelect = ({ arm, departments }: { arm: ArmDetails; departments: DepartmentWithSubjects[] }) => {
  const { mutate, isPending } = useAssignArmToDepartment();
  const [selectedDept, setSelectedDept] = useState<number>();

  const handleAssign = (departmentId: string) => {
    const deptId = parseInt(departmentId, 10);
    setSelectedDept(deptId);
    mutate(
      { armId: arm.id, departmentId: deptId },
      {
        onSuccess: () => {
          toast({
            title: "Assigned Successfully",
            description: `Assigned ${arm.name} to department successfully`,
            type: "success",
          });
        },
        onError: err => {
          toast({
            title: "Failed to assign arm",
            description: (err as { message?: string })?.message || "Could not assign arm to department",
            type: "error",
          });
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-text-default text-sm font-medium capitalize">{arm.name}</div>
      <Select value={selectedDept?.toString()} onValueChange={handleAssign} disabled={isPending}>
        <SelectTrigger className="h-11 w-full border-none">
          <SelectValue placeholder="Assign to a department" className="capitalize">
            <span className="text-text-default capitalize">
              {selectedDept ? departments.find(dept => dept.departmentId === selectedDept)?.name.toLowerCase() : "Assign to a department"}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-bg-card border-border-default">
          {departments.map(dept => (
            <SelectItem key={dept.departmentId} value={dept.departmentId.toString()} className="text-text-default text-sm font-medium capitalize">
              {dept.name.toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="text-text-muted text-xs">Students in this arm will do the assigned department subjects</div>
    </div>
  );
};
