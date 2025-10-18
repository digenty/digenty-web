import { Breadcrumb as BreadcrumbComponent, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export const Breadcrumb = ({ className }: { className?: string }) => {
  return (
    <BreadcrumbComponent className={cn(className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="text-text-muted text-sm font-medium">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {/* Make dyna,mic for subpages. Add text color for the last item on the breadcrumb */}
        {/* <BreadcrumbSeparator /> */}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
};
