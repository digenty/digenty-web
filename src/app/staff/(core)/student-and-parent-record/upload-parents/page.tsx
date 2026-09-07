import { ManageAccessGate } from "@/components/StudentAndParent/ManageAccessGate";
import { ParentsUpload } from "@/components/StudentAndParent/Parent/ParentsUpload";

export default function page() {
  return (
    <ManageAccessGate>
      <ParentsUpload />
    </ManageAccessGate>
  );
}
