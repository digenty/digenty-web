import { Student } from "@/api/types";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
export const LinkedStudentMobileCard = ({ student }: { student: Student }) => {
  const router = useRouter();
  return (
    <div className="border-border-default bg-bg-card rounded-md border">
      <div className="flex h-9.5 items-center justify-between px-3 py-1.5 text-sm">
        <span className="text-text-muted font-medium">Name</span>
        <div className="flex items-center gap-2">
          <Avatar className="size-5" url={student.image ?? ""} />
          <span className="text-text-default text-sm font-medium">
            {student.firstName} {student.lastName}
          </span>
        </div>
      </div>

      <div className="border-border-default border-t">
        <div className="flex justify-between px-3 py-2 text-sm">
          <span className="text-text-muted font-medium">Class</span>
          <span className="text-text-muted font-normal">{student.class}</span>
        </div>
      </div>

      <div className="border-border-default border-t">
        <div className="flex justify-between px-3 py-2 text-sm">
          <span className="text-text-muted font-medium">Outstanding Fee</span>
          <span className="text-text-muted font-normal">₦30,000</span>
        </div>
      </div>

      <div className="border-border-default border-t">
        <div className="border-border-default flex justify-between border-b px-3 py-2 text-sm">
          <span className="text-text-muted font-medium">Branch</span>
          <span className="text-text-muted font-normal">{student.branch}</span>
        </div>
      </div>

      <div className="flex h-9.5 items-center justify-center p-3">
        <Button
          onClick={() => {
            router.push(`/student-and-parent-record/students/${student.id}`);
          }}
          className="bg-bg-state-secondary border-border-darker text-text-default h-8 w-full border text-sm font-medium"
        >
          <EyeIcon className="text-icon-default-muted size-4" />
          <span>View Profile</span>
        </Button>
      </div>
    </div>
  );
};
