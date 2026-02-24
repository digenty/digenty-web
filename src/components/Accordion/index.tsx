"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { ArrowRightS } from "../Icons/ArrowRightS";
import { ArrowDownS } from "../Icons/ArrowDownS";

interface AccordionProps {
  title: string | ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false, className }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen, children]);

  const toggleAccordion = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={` ${className ?? ""}`}>
      <button
        className="bg-bg-subtle border-border-default flex w-full cursor-pointer items-center justify-between border-b p-2 py-4 md:px-4"
        onClick={toggleAccordion}
      >
        <div className="text-text-default text-md flex items-center gap-2 font-semibold"> {title}</div>
        <span>{isOpen ? <ArrowDownS fill="var(--color-icon-default-muted)" /> : <ArrowRightS fill="var(--color-icon-default-muted)" />}</span>
      </button>
      <div
        ref={contentRef}
        className=""
        style={{
          maxHeight: height,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
