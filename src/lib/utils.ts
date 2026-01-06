import { clsx, type ClassValue } from "clsx";
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";

export const MOBILE_VIEWPORT = 768;

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

const simpleHash = (text: string) => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Ensure the number is a 32-bit integer
  }
  return Math.abs(hash) % 21;
};

export const generateRandomColor = (text: string) => {
  const tailwindColors = [
    "bg-red-100",
    "bg-blue-100",
    "bg-green-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-teal-100",
    "bg-orange-100",
    "bg-lime-100",
    "bg-cyan-100",
    "bg-sky-100",
    "bg-emerald-100",
    "bg-fuchsia-100",
    "bg-rose-100",
    "bg-violet-100",
    "bg-amber-100",
    "bg-gray-100",
    "bg-slate-100",
    "bg-stone-100",
  ];

  return tailwindColors[simpleHash(text)];
};

export const formatDate = (dateInput: string | number | Date) => {
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return ""; // handle invalid dates safely

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const decodeJWT = (token: string) => {
  try {
    const decodedToken = jwtDecode(token);
    if (!decodedToken || !decodedToken.exp) {
      return null;
    } else {
      const decoded = jwtDecode(token);
      return decoded;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};
