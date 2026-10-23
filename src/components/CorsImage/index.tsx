"use client";

import { useState } from "react";

// Loads with CORS so html2canvas can capture it; if the host sends no CORS headers the browser rejects that load, so retry as a plain image to keep it visible on screen.
export const CorsImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [useCors, setUseCors] = useState(true);
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- must be a plain <img> so html2canvas can capture it with useCORS
    <img
      key={String(useCors)}
      src={src}
      alt={alt}
      crossOrigin={useCors ? "anonymous" : undefined}
      onError={() => (useCors ? setUseCors(false) : setFailed(true))}
      className={className}
    />
  );
};
