import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export function isTestEnvironment(): boolean {
  return (
    process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== undefined
  );
}
