type Menu = {
  title: string;
  url: string;
  icon: React.ElementType<React.SVGProps<SVGSVGElement>>;
};

export type NavigationType = {
  title: string;
  menu: Menu[];
};
