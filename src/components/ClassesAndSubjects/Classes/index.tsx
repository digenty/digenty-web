import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

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
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <h2 className="text-text-default text-base font-semibold md:text-lg">My Classes</h2>
        {!isLoading && (
          <span className="bg-bg-state-soft text-text-muted flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium">
            {uniqueClasses?.length ?? 0}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="bg-bg-input-soft h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {uniqueClasses?.map(cl => (
            <div
              key={cl.armId}
              className="border-border-default bg-bg-default shadow-light hover:border-border-darker group flex items-center justify-between gap-3 rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="bg-bg-basic-sky-subtle border-bg-basic-sky-accent text-text-default flex size-10 shrink-0 items-center justify-center rounded-lg border text-sm font-semibold">
                  {cl.classArmName.trim().charAt(0).toUpperCase()}
                </span>
                <p className="text-text-default text-md truncate font-semibold">{cl.classArmName}</p>
              </div>

              <Button
                // The class arm name is passed as a query param so the nested page can show it without refetching.
                onClick={() =>
                  router.push(`/staff/classes-and-subjects/classes/overview/${cl.armId}?classArmName=${cl.classArmName.replaceAll(" ", "-")}`)
                }
                className="bg-bg-state-primary hover:bg-bg-state-primary-hover! text-text-white-default h-8 shrink-0 gap-1 rounded-lg px-3"
              >
                View Class
                <ChevronRight className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
