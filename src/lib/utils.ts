import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAvatar(name: string, gender: "MALE" | "FEMALE") {
  const username = name.replace(/\s+/g, "").toLowerCase();
  const base = "https://avatar.iran.liara.run/public";
  if (gender === "FEMALE") return `${base}/girl?username=${username}`;
  // default to boy
  return `${base}/boy?username=${username}`;
}
export const formatPhoneNumber = (value: string) => {
  if (!value) return value;

  // Remove all non-digit characters
  const phoneNumber = value.replace(/[^\d]/g, "");
  const phoneNumberLength = phoneNumber.length;

  if (phoneNumberLength <= 5) return phoneNumber;

  // Format as "XXXXX XXXXX"
  const firstPart = phoneNumber.slice(0, 5);
  const secondPart = phoneNumber.slice(5, 10);

  return `${firstPart}${secondPart ? " " + secondPart : ""}`;
};

