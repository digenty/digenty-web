import { ManageAccessGate } from "@/components/StudentAndParent/ManageAccessGate";
import { StudentsUpload } from "@/components/StudentAndParent/Students/StudentsUpload";

export default function page() {
  return (
    <ManageAccessGate>
      <StudentsUpload />
    </ManageAccessGate>
  );
}
