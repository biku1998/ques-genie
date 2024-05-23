import { type ClassValue, clsx } from "clsx";
import { Base64 } from "js-base64";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const encodeToBase64 = (text: string): string => {
  return Base64.encode(text);
};
