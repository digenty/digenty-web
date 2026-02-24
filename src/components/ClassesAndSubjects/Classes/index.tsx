import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { Skeleton } from "@/components/ui/skeleton";

type classItem = {
  classArmName: string;
  classId: number;
  armId: number;
};

type ClassProps = {
  classes: classItem[];
  isLoading: boolean;
};

export const MyClasses = ({ isLoading, classes }: ClassProps) => {
  const router = useRouter();
  const uniqueClasses = classes?.filter((cl, index, self) => index === self.findIndex(c => c.armId === cl.armId));

  return (
    <div className="">
      <div className="flex-start bg-bg-muted flex w-full flex-col gap-1.5 rounded-lg pt-1 pr-1 pb-2 pl-1 md:max-w-219 md:gap-3 md:pt-1 md:pr-3 md:pb-3 md:pl-3">
        <h2 className="text-text-default px-6 pt-1.5 text-base font-semibold md:px-5 md:pt-3">My Classes</h2>
        {isLoading ? (
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="bg-bg-input-soft h-30 w-full md:max-w-219" />
            ))}
          </div>
        ) : (
          <>
            <ul className="bg-bg-card border-border-default w-full rounded-sm border shadow-sm md:max-w-213">
              {uniqueClasses?.map(cl => {
                return (
                  <div key={cl.armId} className="border-border-default border-b">
                    <div className="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:gap-2 md:p-2 md:px-6 md:py-5">
                      <div className="flex flex-col gap-1 md:gap-2">
                        <p className="text-text-default text-md font-semibold">{cl.classArmName}</p>
                      </div>

                      <div>
                        <Button
                          // onClick={() => router.push(`/classes-and-subjects/classes/${cl.armId}`)}
                          // am doin this cuz i wan the classArmName on the nested page , if there is a better way ?
                          onClick={() => router.push(`/classes-and-subjects/classes/${cl.classId}?classArmName=${cl.classArmName}`)}
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
          </>
        )}
      </div>
    </div>
  );
};
