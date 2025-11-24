import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ClassItem } from "../Subjects/Subject";

const classes: ClassItem[] = [
  { id: 0, grade: "JSS 1A", subjectStatus: "Not Started" },
  { id: 1, grade: "JSS 2A", subjectStatus: "In Progress" },
  { id: 2, grade: "JSS 3A", subjectStatus: "Submitted" },
  { id: 3, grade: "SS 1A", subjectStatus: "Request Edit Access" },
  { id: 4, grade: "SS 2A", subjectStatus: "Submitted" },
  { id: 5, grade: "SS 3A", subjectStatus: "Submitted" },
];

export const MyClasses = () => {
  const router = useRouter();
  return (
    <div className="">
      <div className="flex-start bg-bg-muted flex w-full flex-col gap-1.5 rounded-lg pt-1 pr-1 pb-2 pl-1 md:max-w-219 md:gap-3 md:pt-1 md:pr-3 md:pb-3 md:pl-3">
        <h2 className="text-text-default px-6 pt-1.5 text-base font-semibold md:px-5 md:pt-3">My Classes</h2>
        <ul className="bg-bg-card border-border-default w-full rounded-sm border shadow-sm md:max-w-213">
          {classes.map(cl => {
            return (
              <div key={cl.id} className="border-border-default border-b">
                <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:gap-2 md:p-2 md:px-6 md:py-5">
                  <div className="flex flex-col gap-1 md:gap-2">
                    <p className="text-text-default text-md font-semibold">{cl.grade}</p>
                  </div>

                  <div>
                    <Button
                      onClick={() => router.push(`/classes-and-subjects/classes/${cl.id}/subjects`)}
                      className="bg-bg-state-primary hover:bg-bg-state-primary/90! text-text-white-default h-7 w-24 rounded-md px-2 py-1"
                    >
                      View Class
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
