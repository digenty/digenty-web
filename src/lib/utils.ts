import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const MOBILE_VIEWPORT = 768;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
