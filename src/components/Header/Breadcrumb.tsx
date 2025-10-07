import { Breadcrumb as BreadcrumbComponent, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export const Breadcrumb = ({ className }: { className?: string }) => {
  return (
    <BreadcrumbComponent className={cn(className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="text-sm font-medium">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {/* <BreadcrumbSeparator /> */}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
};
