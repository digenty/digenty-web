import React, { SVGProps } from "react";

export const ExpandUpDownFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15" fill="none" {...props}>
      <path d="M10 5L5 0L0 5H10ZM10 10L5 15L0 10H10Z" fill={props.fill} />
    </svg>
  );
};
