import { SVGProps } from "react";

export const BookOpenFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" {...props}>
      <path
        d="M14.25 13.5H8.25V2.25C8.25 1.00736 9.25732 0 10.5 0H14.25C14.6642 0 15 0.33579 15 0.75V12.75C15 13.1642 14.6642 13.5 14.25 13.5ZM6.75 13.5H0.75C0.33579 13.5 0 13.1642 0 12.75V0.75C0 0.33579 0.33579 0 0.75 0H4.5C5.74264 0 6.75 1.00736 6.75 2.25V13.5ZM6.75 13.5H8.25V15H6.75V13.5Z"
        fill={props.fill}
      />
    </svg>
  );
};
