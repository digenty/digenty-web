import { AllClassesView } from "@/components/CBT/AllClassesView";

export default function ClassesPage() {
  return (
    <div className="p-8">
      <div className="mb-5">
        <h1 className="text-lg font-semibold text-gray-900">All Classes</h1>
      </div>
      <AllClassesView />
    </div>
  );
}
