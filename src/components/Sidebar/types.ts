type Menu = {
  title: string;
  url: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export type NavigationType = {
  title: string;
  menu: Menu[];
};
