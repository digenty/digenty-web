import { SVGProps } from "react";

export const BillFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none" {...props}>
      <path
        d="M12.75 15H0.75C0.33579 15 0 14.6642 0 14.25V0.75C0 0.33579 0.33579 0 0.75 0H12.75C13.1642 0 13.5 0.33579 13.5 0.75V14.25C13.5 14.6642 13.1642 15 12.75 15ZM3.75 5.25V6.75H9.75V5.25H3.75ZM3.75 8.25V9.75H9.75V8.25H3.75Z"
        fill={props.fill}
      />
    </svg>
  );
};
