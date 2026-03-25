import React, { SVGProps } from "react";

export const BagFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 14 17" fill="none" {...props}>
      <path
        d="M10.5 1.5H12.75C13.1642 1.5 13.5 1.83579 13.5 2.25V15.75C13.5 16.1642 13.1642 16.5 12.75 16.5H0.75C0.33579 16.5 0 16.1642 0 15.75V2.25C0 1.83579 0.33579 1.5 0.75 1.5H3V0H4.5V1.5H9V0H10.5V1.5ZM3 6V7.5H10.5V6H3ZM3 9V10.5H10.5V9H3Z"
        fill={props.fill}
      />
    </svg>
  );
};
