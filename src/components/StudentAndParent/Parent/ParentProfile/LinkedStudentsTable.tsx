import { Student } from "@/api/types";
import { DataTable } from "@/components/DataTable";
import { Draft } from "@/components/Icons/Draft";
import { Badge } from "@/components/ui/badge";
import { AdmissionStatus, BoardingStatus, Gender } from "@/types";
import { Check, CheckCheck, TriangleAlert, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LinkedStudentMobileCard } from "./LinkedStudentMobileCard";
import { columns } from "./LinkedStudentsColumn";

const students: Student[] = [
  {
    id: 1,
    firstName: "Dayo",
    lastName: "Muna",
    phoneNumber: "08123456789",
    email: "8F5dH@example.com",
    image: "",
    tags: [],
    linkedParents: [],
    uuid: "",
    middleName: "",
    gender: Gender.Male,
    boardingStatus: BoardingStatus.Day,
    dateOfBirth: "",
    address: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    secondaryPhoneNumber: "",
    studentStatus: AdmissionStatus.Graduated,
    admissionNumber: "",
    medicalInformation: "",
    nationality: "",
    stateOfOrigin: "",
    joinedSchoolTerm: "",
    joinedSchoolSession: "",
    branch: "Gbagada",
    class: "JSS 1A",
    departmentId: null,
    armId: null,
  },
];

export const getBadge = (status: string) => {
  switch (status) {
    case "Paid":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" />
          <span>Paid</span>
        </Badge>
      );
    case "Successful":
      return (
        <Badge className="bg-bg-badge-green text-bg-basic-green-strong border-border-default h-5 rounded-md text-xs font-medium">
          <Check className="size-3" />
          <span>Successful</span>
        </Badge>
      );
    case "Unpaid":
      return (
        <Badge className="bg-bg-badge-red text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <X className="size-3" />
          <span>Unpaid</span>
        </Badge>
      );
    case "Outstanding":
      return (
        <Badge className="bg-bg-badge-orange text-bg-basic-orange-strong border-border-default h-5 rounded-md text-xs font-medium">
          <TriangleAlert className="size-3" />
          <span>Outstanding</span>
        </Badge>
      );
    case "Fully Paid":
      return (
        <Badge className="bg-bg-badge-lime text-bg-basic-lime-strong border-border-default h-5 rounded-md text-xs font-medium">
          <CheckCheck className="size-3" />
          <span>Fully Paid</span>
        </Badge>
      );
    case "Draft":
      return (
        <Badge className="border-border-default bg-bg-badge-default text-text-subtle h-5 rounded-md text-xs font-medium">
          <Draft className="size-3" fill="var(--color-icon-default-muted)" />
          <span>Draft</span>
        </Badge>
      );
    case "Required":
      return (
        <Badge className="bg-bg-badge-fuchsia text-bg-basic-fuchsia-strong border-border-default h-5 rounded-md text-xs font-medium">
          <span>Required</span>
        </Badge>
      );
    default:
      return (
        <Badge className="bg-bg-red-green text-bg-basic-red-strong border-border-default h-5 rounded-md text-xs font-medium">
          <X className="size-3" />
          <span>Unpaid</span>
        </Badge>
      );
  }
};

export const LinkedStudentsTable = () => {
  const [page, setPage] = useState(1);
  const [rowSelection, setRowSelection] = useState({});
  const [selectedRows, setSelectedRows] = useState<Student[]>([]);
  console.log(selectedRows);
  const router = useRouter();
  const pageSize = 10;

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-text-default text-lg font-semibold">Linked Students</h2>
      </div>

      {/* desktop table */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={students}
          totalCount={students.length}
          page={page}
          setCurrentPage={setPage}
          pageSize={pageSize}
          clickHandler={row => {
            router.push(`/student-and-parent-record/students/${row.original.id}`);
          }}
          showPagination={false}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          onSelectRows={setSelectedRows}
        />
      </div>

      {/* Mobile View */}
      <div className="flex flex-col gap-4 md:hidden">
        {students.map(student => {
          return <LinkedStudentMobileCard student={student} key={student.id} />;
        })}
      </div>
    </div>
  );
};
