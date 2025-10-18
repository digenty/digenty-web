
type Menu = {
  title: string;
  url: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;
};

export type NavigationType = {
  title: string;
  menu: Menu[];
};
