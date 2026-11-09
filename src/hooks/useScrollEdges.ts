import { useEffect, useRef, useState } from "react";

/** Tracks whether a scrollable element is scrolled to its start/end, so callers can show a "more content" hint on the side that still has content to reveal. */
export const useScrollEdges = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setAtStart(el.scrollLeft <= 1);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };

    update();
    el.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  return { ref, atStart, atEnd };
};
