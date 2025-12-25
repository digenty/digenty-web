import React, { SVGProps } from "react";

export const AddFill = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" {...props}>
      <path d="M7.33317 7.33268V2.66602H8.6665V7.33268H13.3332V8.66602H8.6665V13.3327H7.33317V8.66602H2.6665V7.33268H7.33317Z" fill={props.fill} />
    </svg>
  );
};
