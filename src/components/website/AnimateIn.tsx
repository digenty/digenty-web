"use client";

import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";

type From = "bottom" | "left" | "right" | "fade";

const FROM_TRANSFORM: Record<From, string> = {
  bottom: "translateY(28px)",
  left: "translateX(-28px)",
  right: "translateX(28px)",
  fade: "none",
};

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  from?: From;
}

export default function AnimateIn({ children, delay = 0, duration = 650, className, threshold = 0.1, from = "bottom" }: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={
        {
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : FROM_TRANSFORM[from],
          transition: `opacity ${duration}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
          willChange: "opacity, transform",
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
