import { type ClassValue, clsx } from "clsx";
import { Base64 } from "js-base64";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const encodeToBase64 = (text: string): string => {
  return Base64.encode(text);
};

export const getTopicCount = (wordCount: number): number => {
  switch (true) {
    case wordCount <= 1000:
      return 5;
    case wordCount <= 6000:
      return 10;
    case wordCount <= 12000:
      // return 15;
      return 10;
    case wordCount <= 24000:
      // return 24;
      return 10;
    default:
      // return 30;
      return 10;
  }
};

export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).length;
};
/* eslint-disable @typescript-eslint/no-explicit-any */
export const convertSnakeCaseObjectToCamelCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map(convertSnakeCaseObjectToCamelCase) as T;
  } else if (typeof obj === "object" && obj !== null) {
    const result: { [key: string]: any } = {};
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        result[camelKey] = convertSnakeCaseObjectToCamelCase(obj[key]);
      }
    }
    return result as T;
  } else {
    return obj;
  }
};

export const convertToCamelCase = <T>(obj: any): T => {
  if (Array.isArray(obj)) {
    return obj.map(convertToCamelCase) as T;
  } else if (typeof obj === "object" && obj !== null) {
    const result: { [key: string]: any } = {};
    for (const key in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
          letter.toUpperCase(),
        );
        result[camelKey] = convertToCamelCase(obj[key]);
      }
    }
    return result as T;
  } else {
    return obj;
  }
};
