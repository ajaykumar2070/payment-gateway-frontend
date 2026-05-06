import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type CardType =
  | "visa"
  | "master-card"
  | "amex"
  | "unknown";

export function getCardType(cardNumber: string): CardType {
  if(!cardNumber) return "unknown";
  const num = cardNumber.replace(/\D/g, "");
  if (/^4/.test(num)) return "visa";
  if (/^(5[1-5]|2[2-7])/.test(num)) return "master-card";
  if (/^3[47]/.test(num)) return "amex";

  return "unknown";
}


export const formatCardNumber = (value: string) => {
  return value
    .replace(/\D/g, "") // remove non-digits
    .slice(0, 16) // max length
    .replace(/(.{4})/g, "$1 ")
    .trim();
};