import {
  Breadcrumb as BreadcrumbComponent,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { useBreadcrumbStore } from "@/store/breadcrumb";
import { DotIcon } from "lucide-react";

export const Breadcrumb = ({ className }: { className?: string }) => {
  const { breadcrumbs } = useBreadcrumbStore();

  return (
    <BreadcrumbComponent className={cn(className)}>
      <BreadcrumbList>
        {breadcrumbs.length > 0 &&
          breadcrumbs.map((crumb, index) => {
            const textClassName = cn(
              "text-sm font-medium capitalize",
              index === breadcrumbs.length - 1 ? "text-text-default hover:text-text-default" : "text-text-muted hover:text-text-muted",
            );

            return (
              <BreadcrumbPage key={crumb.label} className="flex items-center justify-center gap-2.5">
                <BreadcrumbItem className="gap-2.5">
                  {/* A crumb without a real destination (e.g. the current page) must not render as a
                      clickable link — an anchor with an empty href is a real browser navigation that
                      drops query params and can reload or misroute the page. */}
                  {crumb.url ? (
                    <BreadcrumbLink href={crumb.url} className={textClassName}>
                      {crumb.label}
                    </BreadcrumbLink>
                  ) : (
                    <span className={cn(textClassName, "cursor-default")}>{crumb.label}</span>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator>
                    <DotIcon className="text-icon-default-muted size-1" />
                  </BreadcrumbSeparator>
                )}
              </BreadcrumbPage>
            );
          })}

        {/* Make dyna,mic for subpages. Add text color for the last item on the breadcrumb */}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
};
