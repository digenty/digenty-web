import { ManageAccessGate } from "@/components/StudentAndParent/ManageAccessGate";
import { AddParent } from "@/components/StudentAndParent/Parent/AddParent/AddParent";

export default function page() {
  return (
    <ManageAccessGate>
      <AddParent />
    </ManageAccessGate>
  );
}
