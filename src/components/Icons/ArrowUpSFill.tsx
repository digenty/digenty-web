import React, { SVGProps } from "react";

export const ArrowUpSFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="8" height="4" viewBox="0 0 8 4" fill="none" {...props}>
      <path d="M4 0L8 4H0L4 0Z" fill={props.fill} />
    </svg>
  );
};
