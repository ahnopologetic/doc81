import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateContent(content: string, isHovered: boolean) {
  const maxLength = isHovered ? 300 : 150;
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "...";
}