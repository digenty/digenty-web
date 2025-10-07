import { Breadcrumb as BreadcrumbComponent, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";

export const Breadcrumb = () => {
  return (
    <BreadcrumbComponent>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink className="text-sm font-medium">Dashboard</BreadcrumbLink>
        </BreadcrumbItem>

        {/* <BreadcrumbSeparator /> */}
      </BreadcrumbList>
    </BreadcrumbComponent>
  );
};
